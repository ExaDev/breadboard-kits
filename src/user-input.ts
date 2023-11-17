import { Board } from "@google-labs/breadboard";
import HackerNewsAlgoliaKit, { Story } from "kits/hackerNews/hnAlgoliaKit.js";
import ListKit from "kits/listKit.js";
import * as readline from "readline";
import HnFirebaseKit from "./kits/hackerNews/hnFirebaseKit.js";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const board = new Board();
const firebase = board.addKit(HnFirebaseKit);
const algolia = board.addKit(HackerNewsAlgoliaKit);
const output = board.output();
const listKit = board.addKit(ListKit);
const pop = listKit.pop();

const topStoryIdNode = firebase.topStoryIds({
	limit: 1,
});

const getStoryFromId = algolia.getStory();
topStoryIdNode.wire("storyIds->list", pop);
pop.wire("->list", pop);
pop.wire("item->id", getStoryFromId);
getStoryFromId.wire("*", output);

const getStory = async (): Promise<string> => {
	let storyUrl;
	for await (const result of board.run({
	})) {
		if (result.outputs && result.outputs.story_id) {
			const story = result.outputs as unknown as Story
			//console.log(`story ${story.url}`);
			storyUrl = story.url;
		}
		if (result.outputs.error) {
			console.error(result.outputs.error);
		}
	}
	return storyUrl;
}

const storyToDisplay = await getStory();

rl.question("View story? [y] ", (answer) => {
	switch (answer.toLowerCase()) {
		case "y":
			console.log(storyToDisplay);
			break;
		default:
			console.log("Invalid");
	}
	rl.close();
});
