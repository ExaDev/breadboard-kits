import { Board } from "@google-labs/breadboard";
import test from "ava";
import ListKit from "../../../src/kits/ListKit.js";
import MarkdownKit from "../../../src/kits/MarkdownKit.js";
// test markdown works when more than 1 kit is added to a board
test("markdownkit.anotherBoard", async (t) => {
	const board = new Board({
		title: "Markdown Kit Multi-kit",
		description: "Exadev Markdown Kit Multi-kit Test",
		version: "0.0.1",
	});
	const listKit = board.addKit(ListKit);
	const markdownKit = board.addKit(MarkdownKit)

	const input = board.input({
		$id: "input",
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

	const concat = listKit.concat();
	input.wire("->a", concat);
	input.wire("->b", concat);

	const output = board.output();
	concat.wire("list->", output);

	const result = await board.runOnce({
		a: ["hello"],
		b: ["John"],
	});

	t.deepEqual(result["list"], ["hello", "John"]);


	const input1 = board.input({
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
	input1.wire("->boardjson", generateCombinedMarkdown);
	input2.wire("->filename", generateCombinedMarkdown);
	input3.wire("->title", generateCombinedMarkdown);
	input4.wire("->dir", generateCombinedMarkdown);

	const boardjson = JSON.stringify(board, null, "\t");
	
	await board.runOnce({
		boardjson: boardjson,
		filename: board.title,
		title: board.title,
		dir: "./tests/kits/markdownKit"
	});
});
