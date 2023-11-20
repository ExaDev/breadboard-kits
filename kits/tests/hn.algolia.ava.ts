import { Board } from "@google-labs/breadboard";
import test, { ExecutionContext } from "ava";
import { Core } from "@google-labs/core-kit";
import HackerNewsFirebaseKit from "../src/kits/hackerNews/HackerNewsFirebaseKit.js";
import HackerNewsAlgoliaKit from "../src/kits/hackerNews/HackerNewsAlgoliaKit.js";
import ListKit from "../src/kits/ListKit.js";
import { Story } from "../src/kits/hackerNews/HackerNewsAlgoliaKit.js";

test("hackernews algolia get story by id", async (t: ExecutionContext) => {
	const board = new Board();
	const firebase = board.addKit(HackerNewsFirebaseKit);
	const algolia = board.addKit(HackerNewsAlgoliaKit);
	const output = board.output();
	const listKit = board.addKit(ListKit);
	const pop = listKit.pop();

	const topStoryIdNode = firebase.topStoryIds({
		limit: 2,
	});

	const getStoryFromId = algolia.getStory();
	topStoryIdNode.wire("storyIds->list", pop);
	pop.wire("->list", pop);
	pop.wire("item->id", getStoryFromId);
	getStoryFromId.wire("*", output);

	for await (const result of board.run({
	})) {
		if (result.outputs && result.outputs.story_id) {
			const story = result.outputs as unknown as Story;
			t.assert(story, `story ${story.url}`);
			t.assert(story.title, "story.title");
		}
		if (result.outputs.error) {
			console.error(result.outputs.error);
		}
	}
});

test("Get specific story attributes", async (t: ExecutionContext) => {
	const board = new Board();
	const firebase = board.addKit(HackerNewsFirebaseKit);
	const algolia = board.addKit(HackerNewsAlgoliaKit);
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
	})) {
		if (result.outputs) {
			type storyPartial = {
				algoliaUrl: string;
				story_id: number;
				url: string;
				title: string;
			};

			const expectedNumberOfKeys: number = Object.keys(
				{} as storyPartial
			).length;

			const story: storyPartial = Object.assign(
				{},
				result.outputs
			) as unknown as storyPartial;

			const actualNumberOfKeys: number = Object.keys(story).length;
			t.notDeepEqual(
				actualNumberOfKeys,
				expectedNumberOfKeys,
				"expected number of keys"
			);

			for (const [key, value] of Object.entries(story)) {
				t.truthy(value, `outputs.${key}`);
			}
		}
	}
});
