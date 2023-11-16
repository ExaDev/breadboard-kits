#!/usr/bin/env npx -y tsx watch

import {
	Board,
	InputValues,
	NodeValue,
	OutputValues,
} from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";
import Core from "@google-labs/core-kit";
import fs from "fs";
import generateAndWriteCombinedMarkdown from "util/files/generateAndWriteCombinedMarkdown.js";
import HackerNewsAlgoliaKit from "../src/kits/hackerNews/hnAlgoliaKit.js";
import HnFirebaseKit from "../src/kits/hackerNews/hnFirebaseKit.js";
import ListKit from "../src/kits/listKit.js";
const board = new Board();
const firebase = board.addKit(HnFirebaseKit);
const algolia = board.addKit(HackerNewsAlgoliaKit);

const topStoryIdNode = firebase.topStoryIds({
	limit: 1,
	$id: "topStoryId",
});

export const ObjectKit = new KitBuilder({
	url: "npm:@exadev/breadboard-kits/kits/hackerNews/hnFirebaseKit",
}).build({
	spread: async (
		inputs: InputValues & {
			object: Record<string, NodeValue>;
		}
	): Promise<
		OutputValues & {
			[key: string]: NodeValue;
		}
	> => {
		return Promise.resolve({
			...inputs.object,
		});
	},
});

const listKit = board.addKit(ListKit);
const getStoryFromId = algolia.getStory({
	$id: "getStoryFromId",
});

const popStory = listKit.pop({
	$id: "popStoryId",
});
topStoryIdNode.wire("storyIds->list", popStory);
popStory.wire("->list", popStory);
popStory.wire("item->id", getStoryFromId);

const core = board.addKit(Core);
//////////////////////////////////////////////////
const objectKit = board.addKit(ObjectKit);
//////////////////////////////////////////////////

const storyId = board.input({
	$id: "storyId",
});
storyId.wire("storyId->id", getStoryFromId);
const popChildren = listKit.pop({
	$id: "popChildren",
});
getStoryFromId.wire("children->list", popChildren);

const story = core.passthrough({
	$id: "story",
});

getStoryFromId.wire("*", story);
const storyData = core.passthrough();
// story.wire("*", storyData);
story.wire("->story_id", storyData);
story.wire("->title", storyData);
story.wire("->url", storyData);
story.wire("->points", storyData);
story.wire("->author", storyData);
story.wire("->created_at", storyData);

const storyOutput = board.output({
	$id: "storyOutput",
});

storyData.wire("*", storyOutput);

////////////////////////////////////////////////////////////////////////////////

popChildren.wire("->list", popChildren);
popChildren.wire("children->list", popChildren);
const comment = core.passthrough({
	$id: "comment",
});
popChildren.wire("item->comment", comment);
comment.wire("children->list", popChildren);
const spread = objectKit.spread({
	$id: "spreadComment",
});
comment.wire("comment->object", spread);
spread.wire("children->list", popChildren);
spread.wire("*", board.output({
	$id: "commentOutput"
}));
//////////////////////////////////////////////////
generateAndWriteCombinedMarkdown(board, "hackernews", "hackernews.md");
const mermaidGraphConent = ["```mermaid", "graph LR"];
for await (const result of board.run({
	// probe: new LogProbe(),
})) {
	if (result.type == "input") {
		if (result.node.id == "storyId") {
			result.inputs = {
				storyId: 38241304,
			};
		}
	}
	if (result.type == "output") {
		const output = result.outputs;
		console.log("result.outputs:", output);
		if (output && output.parent_id && output.id) {
			console.log("output.parent_id", output.parent_id);
			mermaidGraphConent.push(
				`  ${output.parent_id as string} --> ${output.id as string}`
			);
			fs.writeFileSync(
				"hackernews.mermaid.md",
				[...mermaidGraphConent, "```"].join("\n")
			);
		}
	}
}
