/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */
import { Board, InputValues, NodeValue, OutputValues, } from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";
import Core from "@google-labs/core-kit";
import { pipeline } from "@xenova/transformers";
import fs from "fs";
import ListKit from "kits/ListKit.js";
import { MarkdownContentType } from "types/markdown.js";
import makeMarkdown from "util/files/makeMarkdown.js";

// text-classification,token-classification,question-answering,fill-mask,summarization,translation,text2text-generation,text-generation,zero-shot-classification,audio-classification,automatic-speech-recognition,text-to-audio,image-to-text,image-classification,image-segmentation,zero-shot-image-classification,object-detection,zero-shot-object-detection,document-question-answering,image-to-image,depth-estimation,feature-extraction
type Task =
	| "text-classification"
	| "token-classification"
	| "question-answering"
	| "fill-mask"
	| "summarization"
	| "translation"
	| "text2text-generation"
	| "text-generation"
	| "zero-shot-classification"
	| "audio-classification"
	| "automatic-speech-recognition"
	| "text-to-audio"
	| "image-to-text"
	| "image-classification"
	| "image-segmentation"
	| "zero-shot-image-classification"
	| "object-detection"
	| "zero-shot-object-detection"
	| "document-question-answering"
	| "image-to-image"
	| "depth-estimation"
	| "feature-extraction";

const DEFAULT_MODEL = "Xenova/distilbert-base-uncased-finetuned-sst-2-english";
const DEFAULT_TASK: Task = "text-classification";

enum Direction {
	ASCENDING = 1,
	DESCENDING = -1,
}

type GetModelsParams = {
	search?: string;
	author?: string;
	filter?: string;
	sort?: "downloads" | "createdAt" | "updatedAt" | "author";
	direction?: Direction | "ascending" | "descending";
	limit?: number;
	full?: boolean;
	config?: boolean;
};
//////////////////////////////////////////////////
// const xenovaKit = KitBuilder.wrap({
// 	url: "npm:@xenova/transformers",
// }, {
// 	pipeline: xenovaLib.pipeline,
//
// })
// type Model= {
// 	[key: string]: NodeValue;
// 	// Add index signature for type 'string'
// id: string;
// 	revision: string;
// 	// config?: { [key: string]: NodeValue };
// 	config?: { [key: string]: NodeValue };
// }

export type Model = {
	// [key: string]: NodeValue | { [key: string]: NodeValue };
	[key: string]: NodeValue;
	_id: string;
	id: string;
	likes: number;
	private: boolean;
	downloads: number;
	tags: string[];
	pipeline_tag?: string;
	createdAt: string;
	modelId: string;
};
//////////////////////////////////////
export type FullModel = Model & {
	author: string;
	lastModified: string;
	sha: string;
	library_name: string;
	siblings: Sibling[];
};

export type Sibling = {
	rfilename: string;
};

//////////////////////////////////////
export type ModelWithConfig = Model & {
	config: Config;
};

export type Config = {
	architectures?: string[];
	model_type?: string;
	task_specific_params?: TaskSpecificParams;
	auto_map?: AutoMap;
};

export type TaskSpecificParams = {
	"text-generation"?: TextGeneration;
	summarization?: Summarization;
	translation_en_to_de?: TranslationEnToDe;
	translation_en_to_fr?: TranslationEnToFr;
	translation_en_to_ro?: TranslationEnToRo;
};

export type TextGeneration = {
	do_sample: boolean;
	max_length: number;
	temperature?: number;
};

export type Summarization = {
	early_stopping: boolean;
	length_penalty: number;
	max_length: number;
	min_length: number;
	no_repeat_ngram_size: number;
	num_beams: number;
	prefix?: string;
};

export type TranslationEnToDe = {
	early_stopping: boolean;
	max_length: number;
	num_beams: number;
	prefix: string;
};

export type TranslationEnToFr = {
	early_stopping: boolean;
	max_length: number;
	num_beams: number;
	prefix: string;
};

export type TranslationEnToRo = {
	early_stopping?: boolean;
	max_length?: number;
	num_beams?: number;
	prefix?: string;
	decoder_start_token_id?: number;
};

export type AutoMap = {
	AutoConfig: string;
	AutoModel?: string;
	AutoModelForCausalLM?: string;
	AutoModelForQuestionAnswering?: string;
	AutoModelForSequenceClassification?: string;
	AutoModelForTokenClassification?: string;
	AutoModelForMaskedLM?: string;
};
//////////////////////////////////////
export type FullModelWithConfig = FullModel & ModelWithConfig;

type ModelVariants = Model | FullModel | ModelWithConfig | FullModelWithConfig;

//////////////////////////////////////

async function getModels(
	params: GetModelsParams = {}
): Promise<{ models: ModelVariants[]; url: string; }> {
	let url = "https://huggingface.co/api/models";

	const queryParams = new URLSearchParams();

	if (params.search) queryParams.append("search", params.search);
	if (params.author) queryParams.append("author", params.author);
	queryParams.append("filter", params.filter ?? "transformers.js");
	queryParams.append("sort", params.sort ?? "downloads");
	if (params.direction) {
		if (typeof params.direction === "string") {
			if (params.direction.toLowerCase().startsWith("asc")) {
				params.direction = Direction.ASCENDING;
			} else if (params.direction.toLowerCase().startsWith("desc")) {
				params.direction = Direction.DESCENDING;
			}
		}
	}
	queryParams.append(
		"direction",
		String(params.direction ?? Direction.DESCENDING)
	);
	if (params.limit) queryParams.append("limit", String(params.limit));
	if (params.full) queryParams.append("full", String(params.full));
	if (params.config) queryParams.append("config", String(params.config));

	url = `${url}?${queryParams.toString()}`;
	const response = await fetch(url);
	let models = (await response.json()) as Model[];

	if (params.config && params.full) models = models as FullModelWithConfig[];
	if (params.config) models = models as ModelWithConfig[];
	if (params.full) models = models as FullModel[];
	return {
		url,
		models,
	};
}

const xenovaKitBuilder = new KitBuilder({
	url: "npm:@xenova/transformers",
}).build({
	async pipeline(
		inputs: InputValues & {
			input?: string;
			model?: string;
			task?: string;
		}
	): Promise<OutputValues | void> {
		inputs.model = inputs.model ?? DEFAULT_MODEL;
		inputs.task = inputs.task ?? DEFAULT_TASK;
		if (!inputs.input) {
			throw new Error("input required");
		}
		if (!inputs.model) {
			throw new Error("model required");
		}
		if (!inputs.task) {
			throw new Error("task required");
		}

		try {
			console.log("downloading", inputs.model);
			const pipe = await pipeline(inputs.task, inputs.model);

			console.log("loading", inputs.model);
			const output = await pipe(inputs.input);

			return {
				...inputs,
				output,
			};

		} catch (error) {
			console.error("error", error);
			return {
				...inputs,
				$error: error as NodeValue,
			};
		}
		// const output = await pipeline(
		// 	inputs.task,
		// 	inputs.model
		// ).then((pipe) => pipe(inputs.input))

	},
	async getModels(
		inputs: InputValues & GetModelsParams
	): Promise<OutputValues & { models: ModelVariants[]; url: string; }> {
		// const {models, url} = await getModels(inputs);
		return await getModels(inputs);
	},
});

const filterKitBuilder = new KitBuilder({
	url: "npm:@exadev/filterKit",
}).build({
	async filter(
		inputs: InputValues & {
			list?: string[];
			filter?: string;
		}
	): Promise<OutputValues & { list: NodeValue[]; }> {
		if (!inputs.list) {
			throw new Error("list required");
		}
		if (!inputs.filter) {
			throw new Error("filter required");
		}

		const regex = new RegExp(inputs.filter);
		return Promise.resolve({
			list: inputs.list.filter((item) => regex.test(item)),
		});
	},
	async filterObjects(
		inputs: InputValues & {
			list?: {
				[key: string]: NodeValue;
			}[];
			filter?: string;
			attribute?: string;
		}
	): Promise<OutputValues & { list: NodeValue[]; }> {
		if (!inputs.list) {
			throw new Error("list required");
		}
		if (!inputs.filter) {
			throw new Error("filter required");
		}
		if (!inputs.attribute) {
			throw new Error("attribute required");
		}

		const regex = new RegExp(inputs.filter);
		console.log(regex);
		const included = inputs.list.filter(
			(item) =>
				inputs.attribute && regex.test(item[inputs.attribute] as string)
		);
		const excluded = inputs.list.filter(
			(item) => included.indexOf(item) === -1
		);

		return Promise.resolve({
			list: included,
			included,
			excluded,
		});
	},
	async deduplicate(
		inputs: InputValues & {
			list?: string[];
		}
	): Promise<OutputValues & { list: NodeValue[]; }> {
		if (!inputs.list) {
			throw new Error("list required");
		}
		return Promise.resolve({
			list: [...new Set(inputs.list)],
		});
	}
});

const board = new Board();

const listKit = board.addKit(ListKit);
const core = board.addKit(Core);
const xenovaKit = board.addKit(xenovaKitBuilder);
///////
// const input = board.input({
// 	$id: "input",
// });
//
// const xenovaKit = board.addKit(xenovaKitBuilder);
// const transformer = xenovaKit.pipeline({
// 	$id: "xenova-transformer",
// 	input: "I love you",
// });

const transformerModels = xenovaKit.getModels({
	// search: "distilbert",
	sort: "downloads",
	filter: "transformers.js",
	// filter: "onnx",
	// filter: "",
	// limit: 3,
});
// transformerModels.wire("*", board.output({$id: "transformer"}));
const onnx = xenovaKit.getModels({
	// search: "distilbert",
	sort: "downloads",
	filter: "onnx",
	// filter: "onnx",
	// filter: "",
	// limit: 3,
});
// onnx.wire("*", board.output({$id: "onnx"}));

// // models.wire("*", board.output());
// const listKit = board.addKit(ListKit);
////////////////////////////////////////////////////////////////////////
const popModel = listKit.pop();
// transformerModels.wire("models->list", popModel)
// onnx.wire("models->list", popModel)
////////////////////////////////////////////////////////////////////////
// const modelListId: string = "models";
// const modeList = board.output({ $id: modelListId });
////////////////////////////////////////////////////////////////////////
const filterKit = board.addKit(filterKitBuilder);
const transformerTextClassificationModels = filterKit.filterObjects({
	$id: "transformerJsTextClassificationModels",
	filter: "text-classification",
	attribute: "pipeline_tag",
});

transformerModels.wire("models->list", transformerTextClassificationModels);
////////////////////////////////////////////////////////////////////////
const onnxTextClassificationModels = filterKit.filterObjects({
	$id: "onnxTextClassificationModels",
	filter: "text-classification",
	attribute: "pipeline_tag",
});
onnx.wire("models->list", onnxTextClassificationModels);
// textClassificationModels.wire("*", modeList);
////////////////////////////////////////////////////////////////////////

// const join = listKit.concat()
// transformerModels.wire("models->a", join);
// onnx.wire("models->b", join);
// join.wire("list", filter);

// textClassificationModels.wire("list", popModel);
////////////////////////////////////////////////////////////////////////
const transformerJsSummarisationModels = filterKit.filterObjects({
	$id: "summarizationModels",
	filter: "summarization",
	attribute: "pipeline_tag",
});
transformerModels.wire("models->list", transformerJsSummarisationModels);
////////////////////////////////////////////////////////////////////////
const onnxSummarisationModels = filterKit.filterObjects({
	$id: "summarizationModels",
	filter: "summarization",
	attribute: "pipeline_tag",
});
onnx.wire("models->list", onnxSummarisationModels);
////////////////////////////////////////////////////////////////////////
const transformerJsDocumentQuestionAnsweringModels = filterKit.filterObjects({
	$id: "documentQuestionAnsweringModels",
	filter: "document-question-answering",
	attribute: "pipeline_tag",
});
transformerModels.wire("models->list", transformerJsDocumentQuestionAnsweringModels);
////////////////////////////////////////////////////////////////////////
const onnxDocumentQuestionAnsweringModels = filterKit.filterObjects({
	$id: "documentQuestionAnsweringModels",
	filter: "document-question-answering",
	attribute: "pipeline_tag",
});
onnx.wire("models->list", onnxDocumentQuestionAnsweringModels);
////////////////////////////////////////////////////////////////////////
const transformerJsModelsMergeA = listKit.concat();
transformerTextClassificationModels.wire("list->a", transformerJsModelsMergeA);
transformerJsSummarisationModels.wire("list->b", transformerJsModelsMergeA);

const transformerJsModels = listKit.concat();
transformerJsModelsMergeA.wire("list->a", transformerJsModels);
transformerJsDocumentQuestionAnsweringModels.wire("list->b", transformerJsModels);
////////////////////////////////////////////////////////////////////////
const onnxModelsMergeA = listKit.concat();
onnxTextClassificationModels.wire("list->a", onnxModelsMergeA);
onnxSummarisationModels.wire("list->b", onnxModelsMergeA);
const onnxModels = listKit.concat();
onnxModelsMergeA.wire("list->a", onnxModels);
onnxDocumentQuestionAnsweringModels.wire("list->b", onnxModels);
////////////////////////////////////////////////////////////////////////
const allModels = listKit.concat();
transformerJsModels.wire("list->a", allModels);
onnxModels.wire("list->b", allModels);
const deduplicatedModels = filterKit.deduplicate();
allModels.wire("list", deduplicatedModels);
deduplicatedModels.wire("list", board.output({ $id: "models" }));
// deduplicatedModels.wire("list", modeList);
////////////////////////////////////////////////////////////////////////
// popModel.wire("item->model", board.output({$id: "modelOutput"}));
popModel.wire("list", popModel);
////////////////////////////////////////////////////////////////////////
//
//
// // filter.wire("*", board.output({ $id: "filteredOutput" }));
// filter.wire("list", popModel);
//
// // popModel.wire("item->model", xPipeline)
// const object = board.addKit(ObjectKit);
// const spread = object.spread();
//
// const core = board.addKit(Core);
// const passthrough = core.passthrough();
// popModel.wire("list", popModel);
//
// // const model = core.passthrough();
// popModel.wire("item->object", spread);
// // model.wire("*", spread);
//
// spread.wire("id->model", transformer);
// spread.wire("pipeline_tag->task", transformer);
// const modelOutput = board.output({$id: "modelOutput"});
// spread.wire("id", modelOutput);
// spread.wire("pipeline_tag", modelOutput);
//
//
// // input.wire("input", transformer);
// input.wire("input", transformer);
//
// // passthrough.wire("input", passthrough);
// // passthrough.wire("input", transformer);
// // passthrough.wire("model", transformer);
// // passthrough.wire("task", transformer);
//
// const output = board.output({
// 	$id: "result",
// });
//
// transformer.wire("input", output);
// transformer.wire("output", output);
// transformer.wire("model", output);
// transformer.wire("task", output);
// transformer.wire("*", output);


//////////////////////////////


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const classificationModels = {
	modelIds: [
		"Xenova/bert-base-multilingual-uncased-sentiment",
		"Xenova/distilbert-base-uncased-finetuned-sst-2-english",
		"sabatale/industry-classification-api-onnx",
		// 'Xenova/roberta-large-mnli',
		"huantd/distilbert-base-uncased-finetuned-sst-2-english",
		"Xenova/finbert",
		"HELLOMRKINOBI/distilbert-base-uncased-finetuned-sst-2-english",
		// 'har1/hs2-model',
		"Xenova/toxic-bert",
		"osanseviero/distilbert-base-uncased-finetuned-quantized",
		"Xenova/bge-reranker-large",
		"Xenova/bge-reranker-base",
		"osanseviero2/distilbert-base-uncased-finetuned-quantized",
		// 'SeeeRGo/tg-messages-classificator-onnx-quantized',
		// 'SeeeRGo/onnx-tg',
		"Xenova/distilroberta-finetuned-financial-news-sentiment-analysis",
	],
	task: "text-classification",
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const summarisationModels = {
	modelIds: [
		"Xenova/bart-large-xsum",
		"Xenova/distilbart-xsum-9-6",
		"Xenova/distilbart-xsum-12-3",
		"Xenova/distilbart-xsum-6-6",
		"Xenova/distilbart-xsum-12-1",
		"ahmedaeb/distilbart-cnn-6-6-optimised",
		"Xenova/bart-large-cnn",
		"Xenova/distilbart-cnn-6-6",
		"Xenova/distilbart-cnn-12-3",
		"Xenova/distilbart-cnn-12-6",
		"Xenova/distilbart-xsum-12-6",
	],
	task: "summarization",
};
const selectedModels = summarisationModels;
// const selectedModels = classificationModels

const transformer = xenovaKit.pipeline({
	$id: "xenova-transformer",
	input: "Kittens and puppies are lovely",
	task: selectedModels.task,
});

const modelIdList = core.passthrough({
	$id: "passThrough",
	...selectedModels
});

const popModelId = listKit.pop();
modelIdList.wire("modelIds->list", popModelId);
popModelId.wire("item->model", transformer);
popModelId.wire("list", popModelId);

transformer.wire("*", board.output({ $id: "result" }));

// makeMarkdown({
// 	board,
// 	title: "Xenova",
// 	dir: ".",
// 	filename: "Xenova",
// 	markdownConfig: [MarkdownContentType.mermaid, MarkdownContentType.json],
// });

makeMarkdown({
	board,
	title: "Xenova",
	dir: ".",
	filename: "Xenova",
	markdownConfig: [MarkdownContentType.mermaid, MarkdownContentType.json],
});

const outputBuffer = [];
const collectedModels: Map<string, Model> = new Map();
for await (const run of board.run({
	// probe: new LogProbe(),
})) {
	console.log("=".repeat(80));
	// console.log("node", run.node.id);
	if (run.type === "input") {
		if (run.node.id == "text") {
			run.inputs = {
				input: "I love you",
			};
		} else {
			console.log("input required for", run.node.id);
		}
	} else if (run.type === "output") {
		if (run.node.id === "models") {
			const models = run.outputs.list as Model[];
			for (const model of models) {
				// collectedModels.set(model.id, model);
				collectedModels.set(model.id, model);
			}
		}
		console.log();
		console.log(run.node.id, run.outputs);
		outputBuffer.push({
			nodeId: run.node.id,
			...run.outputs,
		});
	} else {
		// console.log(run);
	}
}
// convert collectedModels to array, sort by downloads, and write to file
fs.writeFileSync("models.json", JSON.stringify([...collectedModels.values()]
	.sort((a, b) => b.downloads - a.downloads)
	// .filter(m => m.pipeline_tag == "summarization")
	// .map(m => m.id)
	.map(m => {
		return {
			id: m.id,
			pipeline_tag: m.pipeline_tag,
			tags: m.tags.filter((t: string) => t == "text-classification" || t == "summarization" || t == "document-question-answering") || undefined,
		};
	})
, null, 2));

fs.writeFileSync("output.json", JSON.stringify(outputBuffer, null, 2));
