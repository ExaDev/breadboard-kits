import { Board } from "@google-labs/breadboard";
import test, { ExecutionContext } from "ava";
import HackerNewsAlgoliaKit, { Story } from "../src/kits/hackerNews/hnAlgoliaKit.js";
import HnFirebaseKit from "../src/kits/hackerNews/hnFirebaseKit.js";
import ListKit from "../src/kits/listKit.js";

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
