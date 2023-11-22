import test from "ava";
import { Board } from "@google-labs/breadboard";
import MarkdownKit from "../../../src/kits/MarkdownKit.js";


test("markdownkit.generateCombinedMarkdown", async (t) => {
	const board = new Board({
		title: "Markdown Kit Combined",
		description: "Exadev Markdown Kit Combined Test",
		version: "0.0.1",
	});

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const markdownKit = board.addKit(MarkdownKit);

	const input = board.input({
		$id: "board",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const input2 = board.input({
		$id: "filename",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const input3 = board.input({
		$id: "title",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const input4 = board.input({
		$id: "directory",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "concat",
				},
			},
		},
	});

	const generateCombinedMarkdown = markdownKit.generateCombinedMarkdown();
	input.wire("->boardjson", generateCombinedMarkdown);
	input2.wire("->filename", generateCombinedMarkdown);
	input3.wire("->title", generateCombinedMarkdown);
	input4.wire("->dir", generateCombinedMarkdown);

	const boardjson = JSON.stringify(board, null, "\t");
	// doesn't return anything, just writes to disk
	await board.runOnce({
		boardjson: boardjson,
		filename: board.title,
		title: board.title,
		dir: "./tests/kits/markdownKit"
	});

	// void function
	t.is(true, true);
});
