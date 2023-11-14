import { Board } from "@google-labs/breadboard";
import test from "ava";
import ListKit from "../src/kits/listKit.js";

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
	
	input.wire("->a", concat)
	input.wire("->b", concat)

	const output = board.output();

	concat.wire("list->", output)
	
	const result = await board.runOnce({
		a:"hello",
		b:"John"
	});

    console.log("RESULT", result)

	t.is(result["list"], "helloJohn");
});
