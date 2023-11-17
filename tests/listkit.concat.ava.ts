import { Board } from "@google-labs/breadboard";
import test from "ava";
import ListKit from "../src/kits/ListKit.js";

test("listkit.concat", async (t) => {
	const board = new Board({
		title: "Exadev",
		description: "Exadev Breadboard Kit",
		version: "0.0.1",
	});
	const listKit = board.addKit(ListKit);

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
		b: ["John"]
	});

	// this should work for strings because it's just a sequence of characters
	const result2 = await board.runOnce({
		a: "hello",
		b: "John"
	});

	t.deepEqual(result["list"], ["hello", "John"]);
	t.is(result2["list"], "helloJohn");
});
