import { Board } from "@google-labs/breadboard";
import ListKit from "src/kits/listKit.js";
import test from "ava";

test("addKit", async (t) => {
	const board = new Board({
		title: "Exadev",
		description: "Exadev Breadboard Kit",
		version: "0.0.1",
	});

	const listKit = board.addKit(ListKit);

	const query = board.input({
		$id: "input",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "push",
					description: "What are you going to push",
				},
			},
		},
	});

	const list = board.input({
		$id: "list",
		schema: {
			type: "object",
			properties: {
				list: {
					type: "array",
					title: "list",
					description: "list",
				},
			},
		},
	});

	const push = listKit.push();

	query.wire("->item", push);
	list.wire("->list", push);
	push.wire("list->", board.output());

	const output = await board.runOnce({
		list: ["a", "b", "c"],
		item: "d",
	});

	t.is((<string[]>output["list"]).length, 4);
});
