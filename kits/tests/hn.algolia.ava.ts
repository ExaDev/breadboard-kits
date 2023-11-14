import { Board, LogProbe } from "@google-labs/breadboard";
import test, { ExecutionContext } from "ava";
import HackerNewsAlgoliaKit, { Story } from "../src/kits/hackerNews/hnAlgoliaKit.js";
import HnFirebaseKit from "../src/kits/hackerNews/hnFirebaseKit.js";
import ListKit from "../src/kits/listKit.js";
import { Core } from "@google-labs/core-kit";

test("hackernews algolia get story by id", async (t: ExecutionContext) => {
	const board = new Board();
	const firebase = board.addKit(HnFirebaseKit);
	const algolia = board.addKit(HackerNewsAlgoliaKit);
	const output = board.output();
	const listKit = board.addKit(ListKit);
	const pop = listKit.pop();

	const topStoryIdNode = firebase.topStoryIds({
		limit: 2,
	});

	const getStoryFromId = algolia.getStory()
	topStoryIdNode.wire("storyIds->list", pop);
	pop.wire("->list", pop);
	pop.wire("item->id", getStoryFromId);
	getStoryFromId.wire("*", output);

	for await (const result of board.run({
		// probe: new LogProbe(),
	})) {
		if (result.outputs && result.outputs.story_id) {
			const story = result.outputs as unknown as Story
			// console.log("result.outputs:",result.outputs);
			t.assert(story, `story ${story.url}`)
			t.assert(story.title, "story.title");
		}
		if (result.outputs.error) {
			console.error(result.outputs.error);
		}
	}
})

test("Get specific story attributes", async (t: ExecutionContext) => {
	const board = new Board();
	const firebase = board.addKit(HnFirebaseKit);
	const algolia = board.addKit(HackerNewsAlgoliaKit);
	// const output = board.output();
	const listKit = board.addKit(ListKit);

	const pop = listKit.pop();

	const topStoryIdNode = firebase.topStoryIds({
		limit: 2,
	});

	const getStoryFromId = algolia.getStory();
	topStoryIdNode.wire("storyIds->list", pop);
	pop.wire("->list", pop);
	pop.wire("item->id", getStoryFromId);

	const core = board.addKit(Core);

	const aggregate = core.passthrough();

	getStoryFromId.wire("->algoliaUrl", aggregate);
	getStoryFromId.wire("->story_id", aggregate);
	getStoryFromId.wire("->url", aggregate);
	getStoryFromId.wire("->title", aggregate);

	aggregate.wire("*", board.output());

	for await (const result of board.run({
		// probe: new LogProbe(),
	})) {
		console.log("------");
		if (result.outputs) {
			console.log("result.outputs", JSON.stringify(result.outputs, null, 2));

			type storyPartial = {
				algoliaUrl: string;
				story_id: number;
				url: string;
				title: string;
			};

			// const story: storyPartial = result.outputs as unknown as  storyPartial
			const story: storyPartial = Object.assign({}, result.outputs) as unknown as  storyPartial
			// console.log("outputs:", JSON.stringify(outputs, null, 2));

			const expectedKeys = [
				"algoliaUrl",
				"story_id",
				"url",
				"title",
			];

			const actualKeys = Object.keys(story)
			console.log("actualKeys:", actualKeys);
			console.log("expectedKeys:", expectedKeys);

			expectedKeys.forEach((key) => {
				// t.assert(actualKeys.includes(key), `outputs.${key}`);
				t.truthy(actualKeys.includes(key), `outputs.${key}`)
			})

			// // t.deepEqual(actualKeys, expectedKeys, "expectedKeys");

			// if (!outputs.algoliaUrl) {
			// 	t.fail("outputs.algoliaUrl");
			// }
			// if (!outputs.story_id) {
			// 	t.fail("outputs.story_id");
			// }
			// if (!outputs.url) {
			// 	t.fail("outputs.url");
			// }
			// if (!outputs.title) {
			// 	t.fail("outputs.title");
			// }
		}
	}
});
