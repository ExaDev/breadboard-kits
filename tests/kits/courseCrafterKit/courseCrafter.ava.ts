/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Board } from "@google-labs/breadboard";
import test from "ava";
import CourseCrafterKit from "../../../src/kits/courseCrafter/CourseCrafterKit.js"
import XenovaKit from "../../../src/kits/XenovaKit.js";
import { ClaudeKit } from "../../../src/kits/ClaudeKit.js";
import { MarkdownContentType } from "../../../src/types/markdown.js";
import makeMarkdown from "../../../src/util/files/makeMarkdown.js";
import fs from "fs";

const TIMEOUT = 200_000
// test("courseCrafterKit.getContent", async (t) => {
// 	const board = new Board({
// 		title: "Course Crafter Kit",
// 		description: "Course Crafter Kit Test",
// 		version: "0.0.1",
// 	});
// 	const courseCraftKit = board.addKit(CourseCrafterKit)

// 	const input = board.input({
// 		$id: "board",
// 		schema: {
// 			type: "object",
// 			properties: {
// 				text: {
// 					type: "string",
// 					title: "Text",
// 					description: "urls",
// 				},
// 			},
// 		},
// 	});

// 	const getContent = courseCraftKit.getContent()
// 	const output = board.output()

// 	input.wire("->url", getContent)
// 	getContent.wire("title->", output)
// 	getContent.wire("blog->", output)

// 	const blogURL = "https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/"
// 	const blogURL2 = "https://developer.chrome.com/blog/automatic-picture-in-picture/"
// 	const blogURL3 = "https://developer.chrome.com/blog/third-party-cookie-deprecation-trial/"

// 	const blogContents = []

// 	const result = await board.runOnce({
// 		url: blogURL
// 	})
// 	blogContents.push({ url: blogURL, title: result["title"], blog: result["blog"] })

// 	const result2 = await board.runOnce({
// 		url: blogURL2
// 	})
// 	blogContents.push({ url: blogURL2, title: result2["title"], blog: result2["blog"] })

// 	const result3 = await board.runOnce({
// 		url: blogURL3
// 	})
// 	blogContents.push({ url: blogURL3, title: result3["title"], blog: result3["blog"] })

// 	// then maybe feed to this to xenova to get a summary
// 	fs.writeFileSync("./tests/kits/courseCrafterKit/output.json", JSON.stringify(blogContents, null, 2));

// 	t.is(true, true);
// });

// test("courseCrafterKit.Blog.Summary", async (t) => {
// 	t.timeout(TIMEOUT);
// 	const board = new Board({
// 		title: "Course Crafter Kit",
// 		description: "Course Crafter Kit Test with Xenova",
// 		version: "0.0.1",
// 	});
// 	const courseCraftKit = board.addKit(CourseCrafterKit)

// 	const input = board.input({
// 		$id: "board",
// 		schema: {
// 			type: "object",
// 			properties: {
// 				text: {
// 					type: "string",
// 					title: "Text",
// 					description: "urls",
// 				},
// 			},
// 		},
// 	});

// 	const getContent = courseCraftKit.getContent()
// 	const output = board.output()

// 	input.wire("->url", getContent)
// 	getContent.wire("title->", output)
// 	getContent.wire("blog->", output)

// 	const blogURL = "https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/"
// 	const blogURL2 = "https://developer.chrome.com/blog/automatic-picture-in-picture/"
// 	const blogURL3 = "https://developer.chrome.com/blog/third-party-cookie-deprecation-trial/"

// 	const result = await board.runOnce({
// 		url: blogURL
// 	})

// 	const result2 = await board.runOnce({
// 		url: blogURL2
// 	})

// 	const result3 = await board.runOnce({
// 		url: blogURL3
// 	})

// 	const models = await getModels({
// 		direction: Direction.DESCENDING,
// 		filter: "transformers.js",
// 	});

// 	const model = models.models
// 		.sort((a, b) => b.likes - a.likes)
// 		.filter((m) => m.pipeline_tag == TransformerTask.summarization)[0];

// 	const pipelineResult = await runPipeline({
// 		input: result["blog"] as string,
// 		model: model.id,
// 		task: TransformerTask.summarization,
// 	});


// 	const pipelineResult2 = await runPipeline({
// 		input: result2["blog"] as string,
// 		model: model.id,
// 		task: TransformerTask.summarization,
// 	});

// 	const pipelineResult3 = await runPipeline({
// 		input: result3["blog"] as string,
// 		model: model.id,
// 		task: TransformerTask.summarization,
// 	});

// 	const outputBuffer = []


// 	outputBuffer.push({ url: blogURL, title: result["title"], blog: result["blog"], model: pipelineResult.model, task: pipelineResult.task, summary: pipelineResult.output })
// 	outputBuffer.push({ url: blogURL2, title: result2["title"], blog: result2["blog"], model: pipelineResult2.model, task: pipelineResult2.task, summary: pipelineResult2.output })
// 	outputBuffer.push({ url: blogURL2, title: result3["title"], blog: result3["blog"], model: pipelineResult3.model, task: pipelineResult3.task, summary: pipelineResult3.output })


// 	fs.writeFileSync("./tests/kits/courseCrafterKit/blog_summary.json", JSON.stringify(outputBuffer, null, 2));

// 	t.is(true, true);
// });

// grabs content using courseCrafter and wires it to xenova kit to get the summary
test("courseCrafterKit.Xenova.Summary", async (t) => {
	t.timeout(TIMEOUT);
	const board = new Board({
		title: "Course Crafter Kit",
		description: "Course Crafter Kit Test with Xenova",
		version: "0.0.1",
	});

	const courseCraftKit = board.addKit(CourseCrafterKit)
	const xenovaKit = board.addKit(XenovaKit)

	const input = board.input({
		$id: "blogDetails",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "urls",
				},
			},
		},
	});


	const taskDetails = board.input({
		$id: "taskDetails",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "model and task",
				},
			},
		},
	});

	const getBlogContentForTask = courseCraftKit.getBlogContentForTask()
	const pipeline = xenovaKit.pipeline()
	const output = board.output()

	input.wire("->url", getBlogContentForTask)
	taskDetails.wire("->model", getBlogContentForTask)
	taskDetails.wire("->task", getBlogContentForTask)

	// wire blog content into xenova pipeline
	getBlogContentForTask.wire("blogContent->input", pipeline)
	getBlogContentForTask.wire("model->model", pipeline)
	getBlogContentForTask.wire("task->task", pipeline)
	// return all results from pipreline
	pipeline.wire("*", output)

	const blogURL = "https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/"
	const result = await board.runOnce({
		url: blogURL,
		model: "Xenova/distilbart-cnn-6-6",
		task: "summarization"
	})

	const outputBuffer = []
	outputBuffer.push({url:blogURL, ...result})

	fs.writeFileSync("./tests/kits/courseCrafterKit/blog_summary.json", JSON.stringify(outputBuffer, null, 2));

	makeMarkdown({board, filename: board.title, title:board.title, dir:"./tests/kits/courseCrafterKit", markdownConfig: [MarkdownContentType.mermaid,MarkdownContentType.json]})

	t.is(true, true);
});

// With Claude WIP
// test("courseCrafterKit.Xenova.Summary.Claude", async (t) => {
// 	t.timeout(TIMEOUT);
// 	const board = new Board({
// 		title: "Course Crafter Kit",
// 		description: "Course Crafter Kit Test with Xenova",
// 		version: "0.0.1",
// 	});

// 	const courseCraftKit = board.addKit(CourseCrafterKit)
// 	const xenovaKit = board.addKit(XenovaKit)
	

// 	const input = board.input({
// 		$id: "blogDetails",
// 		schema: {
// 			type: "object",
// 			properties: {
// 				text: {
// 					type: "string",
// 					title: "Text",
// 					description: "urls",
// 				},
// 			},
// 		},
// 	});

// 	const taskDetails = board.input({
// 		$id: "taskDetails",
// 		schema: {
// 			type: "object",
// 			properties: {
// 				text: {
// 					type: "string",
// 					title: "Text",
// 					description: "model and task",
// 				},
// 			},
// 		},
// 	});

// 	const getBlogContentForTask = courseCraftKit.getBlogContentForTask()
// 	const pipeline = xenovaKit.pipeline()
	
// 	const output = board.output()

// 	input.wire("->url", getBlogContentForTask)
// 	taskDetails.wire("->model", getBlogContentForTask)
// 	taskDetails.wire("->task", getBlogContentForTask)

// 	// wire blog content into xenova pipeline
// 	getBlogContentForTask.wire("blogContent->input", pipeline)
// 	getBlogContentForTask.wire("model->model", pipeline)
// 	getBlogContentForTask.wire("task->task", pipeline)
// 	// return all results from pipreline
// 	pipeline.wire("*", output)

// 	const blogURL = "https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/"
// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 	const result = await board.runOnce({
// 		url: blogURL,
// 		model: "Xenova/distilbart-cnn-6-6",
// 		task: "summarization"
// 	})


// 	// separate board for now
// 	///////////////////////////////////////////////////////////

// 	const board2 = new Board({
// 		title: "Course Crafter Kit",
// 		description: "Course Crafter Kit Test with Xenova",
// 		version: "0.0.1",
// 	});


// 	const claudeKit = board2.addKit(ClaudeKit)
// 	const complete = claudeKit.complete()


// 	const input1 = board.input({
// 		$id: "blogDetails",
// 		schema: {
// 			type: "object",
// 			properties: {
// 				text: {
// 					type: "string",
// 					title: "Text",
// 					description: "urls",
// 				},
// 			},
// 		},
// 	});

// 	const list = board.input({
// 		$id: "number",
// 		schema: {
// 			type: "object",
// 			properties: {
// 				text: {
// 					type: "array",
// 					title: "number",
// 					description: "numbers",
// 				},
// 			},
// 		},
// 	});

// 	const input2 = board.input({
// 		$id: "number",
// 		schema: {
// 			type: "object",
// 			properties: {
// 				text: {
// 					type: "number",
// 					title: "number",
// 					description: "numbers",
// 				},
// 			},
// 		},
// 	});

// 	const input3 = board.input({
// 		$id: "bool",
// 		schema: {
// 			type: "object",
// 			properties: {
// 				text: {
// 					type: "boolean",
// 					title: "number",
// 					description: "numbers",
// 				},
// 			},
// 		},
// 	});

// 	input1.wire("->apiKey", complete)
// 	input1.wire("->model", complete)
// 	input1.wire("->userQuestion", complete)
// 	input1.wire("->maxTokens", complete)
// 	list.wire("->stopSequences", complete)
// 	input2.wire("->temperature", complete)
// 	input2.wire("->topP", complete)
// 	input2.wire("->topK", complete)
// 	input3.wire("->stream", complete)
// 	input1.wire("->url", complete)

// 	complete.wire("*", board2.output())

// 	const summary = result["output"][0]["summary_text"]
// 	const question = `What do think of this summary: ${summary}?`

// 	const VITE_SERVER_PORT = 5173;
// 	const serverUrl = `http://localhost:${VITE_SERVER_PORT}`;

// 	const result2 = board2.runOnce({
// 		apiKey:"apiKey",
// 		model: "claude-2",
// 		userQuestion: question,
// 		maxTokens: 1,
// 		stopSequences: ["stop"],
// 		temperature: 1,
// 		topP: 1,
// 		topK: 1,
// 		stream:1,
// 		url:serverUrl
// 	});

// 	console.log("RESULT", result2)


// 	t.is(true, true);
// });
