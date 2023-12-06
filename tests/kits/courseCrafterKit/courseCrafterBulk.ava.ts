/* eslint-disable @typescript-eslint/no-unused-vars */
import { Board } from "@google-labs/breadboard";
import test from "ava";
import CourseCrafterKit from "../../../src/kits/courseCrafter/CourseCrafterKit.js"
import XenovaKit from "../../../src/kits/XenovaKit.js";
import { ClaudeKit } from "../../../src/kits/ClaudeKit.js";
import { StringKit } from "../../../src/kits/StringKit.js"
import Core from "@google-labs/core-kit";
import { MarkdownContentType } from "../../../src/types/markdown.js";
import makeMarkdown from "../../../src/util/files/makeMarkdown.js";
import fs from "fs";
import { Starter } from "@google-labs/llm-starter";
import { config } from "dotenv";
import { ListKit } from "../../../src/kits/ListKit.js";

const TIMEOUT = 200_000

test("courseCrafterKit.getContent.Bulk", async (t) => {
	t.timeout(TIMEOUT);
	const board = new Board({
		title: "Course Crafter Kit",
		description: "Course Crafter Kit Test",
		version: "0.0.1",
	});

	const courseCraftKit = board.addKit(CourseCrafterKit)
	const xenovaKit = board.addKit(XenovaKit)
	
	const input = board.input({
		$id: "board",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "list",
					title: "Text",
					description: "urls",
				},
			},
		},
	});

	const input2 = board.input({
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


	const getContent = courseCraftKit.getBlogsContent()
	const output = board.output()
	const pipeline = xenovaKit.pipelineBulk()

	input.wire("->list", getContent)
	input2.wire("model->", pipeline)
	input2.wire("task->", pipeline)

	getContent.wire("blogOutput->inputs", pipeline)
	pipeline.wire("*", output)


	const blogURL = "https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/"
	const blogURL2 = "https://developer.chrome.com/blog/automatic-picture-in-picture/"
	const blogURL3 = "https://developer.chrome.com/blog/third-party-cookie-deprecation-trial/"

	const urls = [blogURL, blogURL2, blogURL3]

	
	const result = await board.runOnce({
		list:urls,
		model: "Xenova/distilbart-cnn-6-6",
		task: "summarization",
	});

	const outputBuffer = []

	outputBuffer.push({...result })

	fs.writeFileSync("./tests/kits/courseCrafterKit/blog_bulk.json", JSON.stringify(outputBuffer, null, 2));

	t.is(true, true);
});
