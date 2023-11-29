/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Board } from "@google-labs/breadboard";
import test from "ava";
import fs from "fs";
import CourseCrafterKit from "../../../src/kits/courseCrafter/CourseCrafterKit.js"

import { getModels, runPipeline } from "../../../src/kits/XenovaKit.js";

import {
	Direction,
	TransformerTask,
} from "../../../src/types/xenova.js";


const TIMEOUT = 200_000 

test("courseCrafterKit.getContent", async (t) => {
	const board = new Board({
		title: "Course Crafter Kit",
		description: "Course Crafter Kit Test",
		version: "0.0.1",
	});
	const courseCraftKit = board.addKit(CourseCrafterKit)

	const input = board.input({
		$id: "board",
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

	const getContent = courseCraftKit.getContent()
	const output = board.output()

	input.wire("->url", getContent)
	getContent.wire("title->", output)
	getContent.wire("blog->", output)

	const blogURL = "https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/"
	const blogURL2 = "https://developer.chrome.com/blog/automatic-picture-in-picture/"
	const blogURL3 = "https://developer.chrome.com/blog/third-party-cookie-deprecation-trial/"

	const blogContents = []

	const result = await board.runOnce({
		url: blogURL
	})
	blogContents.push({ url: blogURL, title: result["title"], blog: result["blog"] })

	const result2 = await board.runOnce({
		url: blogURL2
	})
	blogContents.push({ url: blogURL2, title: result2["title"], blog: result2["blog"] })

	const result3 = await board.runOnce({
		url: blogURL3
	})
	blogContents.push({ url: blogURL3, title: result3["title"], blog: result3["blog"] })

	// then maybe feed to this to xenova to get a summary
	fs.writeFileSync("./tests/kits/courseCrafterKit/output.json", JSON.stringify(blogContents, null, 2));

	t.is(true, true);
});

test("courseCrafterKit.Blog.Summary", async (t) => {
	t.timeout(TIMEOUT);
	const board = new Board({
		title: "Course Crafter Kit",
		description: "Course Crafter Kit Test with Xenova",
		version: "0.0.1",
	});

	const courseCraftKit = board.addKit(CourseCrafterKit)

	

	const input = board.input({
		$id: "board",
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

	const getContent = courseCraftKit.getContent()
	const output = board.output()

	input.wire("->url", getContent)
	getContent.wire("title->", output)
	getContent.wire("blog->", output)

	const blogURL = "https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/"
	const blogURL2 = "https://developer.chrome.com/blog/automatic-picture-in-picture/"
	const blogURL3 = "https://developer.chrome.com/blog/third-party-cookie-deprecation-trial/"

	const result = await board.runOnce({
		url: blogURL
	})
	
	const result2 = await board.runOnce({
		url: blogURL2
	})

	const result3 = await board.runOnce({
		url: blogURL3
	})
	
	const models = await getModels({
		direction: Direction.DESCENDING,
		filter: "transformers.js",
	});

	const model = models.models
		.sort((a, b) => b.likes - a.likes)
		.filter((m) => m.pipeline_tag == TransformerTask.summarization)[0];

	const pipelineResult = await runPipeline({
		input: result["blog"] as string,
		model: model.id,
		task: TransformerTask.summarization,
	});


	const pipelineResult2 = await runPipeline({
		input: result2["blog"] as string,
		model: model.id,
		task: TransformerTask.summarization,
	});

	const pipelineResult3 = await runPipeline({
		input: result3["blog"] as string,
		model: model.id,
		task: TransformerTask.summarization,
	});

	const outputBuffer = []


	outputBuffer.push({ url: blogURL, title: result["title"], blog: result["blog"], model: pipelineResult.model, task: pipelineResult.task, summary: pipelineResult.output })
	outputBuffer.push({ url: blogURL2, title: result2["title"], blog: result2["blog"], model: pipelineResult2.model, task: pipelineResult2.task, summary: pipelineResult2.output })
	outputBuffer.push({ url: blogURL2, title: result3["title"], blog: result3["blog"], model: pipelineResult3.model, task: pipelineResult3.task, summary: pipelineResult3.output })


	fs.writeFileSync("./tests/kits/courseCrafterKit/blog_summary.json", JSON.stringify(outputBuffer, null, 2));

	t.is(true, true);
});
