#!/usr/bin/env npx -y tsx watch

import {
	Board,
	InputValues,
	LogProbe,
	NodeValue,
	OutputValues,
} from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";
import Core from "@google-labs/core-kit";
import LLM from "@google-labs/llm-starter";
import fs from "fs";
import generateAndWriteCombinedMarkdown from "util/files/generateAndWriteCombinedMarkdown.js";
import HackerNewsAlgoliaKit from "../src/kits/hackerNews/hnAlgoliaKit.js";
import HnFirebaseKit from "../src/kits/hackerNews/hnFirebaseKit.js";
import ListKit from "../src/kits/listKit.js";
import { ClaudeKit } from "@paulkinlan/claude-breadboard-kit";
const board = new Board();
const firebase = board.addKit(HnFirebaseKit);
const algolia = board.addKit(HackerNewsAlgoliaKit);

const topStoryIdNode = firebase.topStoryIds({
	limit: 1,
	$id: "topStoryId",
});
//////////////////////////////////////////////////
interface AnyObject {
	[key: string]: any;
}

// Function to calculate the depth of an object
function calculateDepth(obj: AnyObject, currentDepth = 0): number {
	if (typeof obj !== "object" || obj === null) {
		return currentDepth;
	}

	let maxDepth = currentDepth;
	for (const key in obj) {
		if (typeof obj[key] === "object" && obj[key] !== null) {
			const depth = calculateDepth(obj[key], currentDepth + 1);
			if (depth > maxDepth) {
				maxDepth = depth;
			}
		}
	}

	return maxDepth;
}

// Function to reduce the depth of an object
function reduceDepth(obj: AnyObject, maxDepth: number): AnyObject {
	function reduce(obj: AnyObject, currentDepth: number): AnyObject {
		if (currentDepth === maxDepth) {
			return Array.isArray(obj) ? [] : {};
		}

		let result: AnyObject = Array.isArray(obj) ? [] : {};

		for (const key in obj) {
			if (typeof obj[key] === "object" && obj[key] !== null) {
				result[key] = reduce(obj[key], currentDepth + 1);
			} else {
				result[key] = obj[key];
			}
		}

		return result;
	}

	return reduce(obj, 0);
}

// Wrapper function to limit the depth of an object
function limitDepth(obj: AnyObject, maxDepth: number): AnyObject {
	const currentDepth = calculateDepth(obj);
	if (currentDepth > maxDepth) {
		return reduceDepth(obj, maxDepth);
	}
	return obj; // Return the object as is if it's within the depth limit
}

//////////////////////////////////////////////////

export const ObjectKit = new KitBuilder({
	url: "npm:@exadev/breadboard-kits/kits/hackerNews/hnFirebaseKit",
}).build({
	pick: async (
		inputs: InputValues & {
			object: Record<string, NodeValue>;
			// {
			// 	[key: string]: NodeValue;
			// }
			key: string;
		}
	): Promise<
		OutputValues & {
			// value: NodeValue;
			// rest: Record<string, NodeValue>;
		}
	> => {
		const { object, key } = inputs;
		// const { [key]: value, ...rest } = object;

		return Promise.resolve({
			// [key]: object[inputs.key] || null,
			value: object[inputs.key] || null,
			// rest,
		});
	},
	pickSeveral: async (
		inputs: InputValues & {
			object: Record<string, NodeValue>;
			keys: string[];
		}
	): Promise<
		OutputValues & {
			// values: Record<string, NodeValue>;
			// rest: Record<string, NodeValue>;
		}
	> => {
		let { object, keys } = inputs;
		const values = {};
		for (const key of keys) {
			const { [key]: value, ...rest } = object;
			values[key] = value;
			object = rest;
		}
		return Promise.resolve({
			...values,
			// rest: object,
		});
	},
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
	nest: async (
		inputs: InputValues & {
			key: string;
		}
	): Promise<OutputValues> => {
		// get all values from inputs except inputs.key
		const { key, ...rest } = inputs;
		return Promise.resolve({
			[key]: rest,
		});
	},
	limitDepth: async (
		inputs: InputValues & {
			object: Record<string, NodeValue>;
			depth: number;
		}
	): Promise<
		OutputValues & {
			object: Record<string, NodeValue>;
		}
	> => {
		const { object, depth } = inputs;
		return Promise.resolve({
			object: limitDepth(object, depth),
		});
	},
});
//////////////////////////////////////////////////
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

const claude = board.addKit(ClaudeKit);

import dotenv from "dotenv";
dotenv.config();
const { CLAUDE_API_KEY } = process.env;

const completion = claude.generateCompletion({
	CLAUDE_API_KEY,
});

////////////////////////////////////////////////////////////////////////////////

const llm = board.addKit(LLM);
const titleTemplate = llm.promptTemplate(
	"Rewrite this title \"{{title}}\"",
	{
		$id: "titleTemplate",
	});
story.wire("title", titleTemplate);

titleTemplate.wire(
	"prompt",
	board.output({
		$id: "populatedTemplate",
	})
);

titleTemplate.wire("prompt->text", completion);
completion.wire(
	"completion",
	board.output({
		$id: "rewriteTitle",
	})
);

////////////////////////////////////////////////////////////////////////////////
const JsonKitBuilder = new KitBuilder({
	url: "npm:@exadev/breadboard-kits/kits/jsonKit",
}).build({
	stringify: async (
		inputs: InputValues & { object: string; }
	): Promise<OutputValues> => {
		const { object } = inputs;
		return Promise.resolve({
			json: JSON.stringify(object),
			// 	JSON.parse(object)
			// )}`,
		});
	},
	parse: async (
		inputs: InputValues & { json: string; }
	): Promise<OutputValues> => {
		const { json } = inputs;
		return Promise.resolve(JSON.parse(json) as Record<string, NodeValue>);
	},
});
////////////////////////////////////////////////////////////////////////////////

const nest = objectKit.nest({
	key: "post",
});
story.wire("*", nest);
const jsonKit = board.addKit(JsonKitBuilder);
const stringify = jsonKit.stringify();

const limit = objectKit.limitDepth({
	depth: 10,
});
nest.wire("post->object", limit);
limit.wire(
	"object->",
	board.output({
		$id: "truncatePost",
	})
);
limit.wire("object->object", stringify);
const instruction = "Summarise the discussion regarding this post";

const postContentTemplate = llm.promptTemplate(
	[
		"{{instruction}}",
		"```json",
		"{{post}}",
		"```"
	].join("\n"),
	{
		$id: "postContentTemplate",
		instruction,
	}
);
const instructionNode = board.input({
	$id: "instruction",
	instruction
});
instructionNode.wire("instruction", postContentTemplate);

stringify.wire("json->post", postContentTemplate);
postContentTemplate.wire(
	"prompt",
	board.output({
		$id: "populatedPostTemplate",
	})
);

const postContentCompletion = claude.generateCompletion({
	$id: "claudePostContentCompletion",
	CLAUDE_API_KEY,
});
postContentTemplate.wire("prompt->text", postContentCompletion);
postContentCompletion.wire(
	"$error",
	board.output({
		$id: "postContentError",
	})
);
postContentCompletion.wire(
	"completion",
	board.output({
		$id: "postContentResponse",
	})
);

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
spread.wire(
	"*",
	board.output({
		$id: "commentOutput",
	})
);

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
