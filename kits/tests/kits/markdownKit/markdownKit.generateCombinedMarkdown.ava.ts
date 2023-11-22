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
	input.wire("->a", generateCombinedMarkdown);
	input2.wire("->b", generateCombinedMarkdown);
	input3.wire("->c", generateCombinedMarkdown);
	input4.wire("->d", generateCombinedMarkdown);

	// NodeValue can't accept Board type, so pass in json string instead
	const myBoard = JSON.stringify(board, null, "\t");
	// doesn't return anything, just writes to disk
	await board.runOnce({
		a: myBoard,
		b: board.title,
		c: board.title,
		d: "./tests/kits/markdownKit"
	});

	// TODO add a check that file has been created and then delete it ??
	// void function, placeholder for now
	t.is(true, true);
});
