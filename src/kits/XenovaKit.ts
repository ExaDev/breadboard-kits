/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */
import { InputValues, NodeValue, OutputValues, } from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";
import { GetModelsParams, ModelVariants, DEFAULT_MODEL, DEFAULT_TASK, Direction, Model, ModelWithConfig, FullModel, FullModelWithConfig } from "../types/xenova.js"
import { pipeline } from "@xenova/transformers";

export const XenovaKit = new KitBuilder({
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
			const pipe = await pipeline(inputs.task, inputs.model);
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
	},
	async getModels(
		inputs: InputValues & GetModelsParams
	): Promise<OutputValues & { models: ModelVariants[]; url: string; }> {
		return await getModels(inputs);
	},
});

export async function getModels(
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

export type XenovaKit = InstanceType<typeof XenovaKit>;
export default XenovaKit
