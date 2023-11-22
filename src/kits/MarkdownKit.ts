/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { KitBuilder, KitBuilderOptions } from "@google-labs/breadboard/kits";
import { InputValues, NodeConfiguration, NodeDescriptor } from "@google-labs/breadboard";
import { Board, Edge } from "@google-labs/breadboard";
import { makeMarkdown } from "../util/files/makeMarkdown.js"
import { MarkdownContentType } from "../types/markdown.js";
import { MarkdownContentList } from "../types/markdown.js";
const MarkdownKit = new KitBuilder({
	url: "npm:@exadev/breadboard-kits/markdownKit",
}).build({
	//TODO change to meaningful variable names
	async generateCombinedMarkdown(inputs: InputValues): Promise<void> {
		const { a, b, c, d }: InputValues = inputs
		const board = jsonStringToBoard(a as string);

		const markdownConfig: MarkdownContentList = [MarkdownContentType.mermaid, MarkdownContentType.json];
		const filename = b as string
		const title = c as string
		const dir = d as string

		makeMarkdown({ board, filename, title, dir, markdownConfig });
	},

	async generateJson(inputs: InputValues): Promise<void> {
		const { a, b, c, d }: InputValues = inputs
		const board = jsonStringToBoard(a as string)

		const markdownConfig: MarkdownContentList = [MarkdownContentType.json];
		const filename = b as string
		const title = c as string
		const dir = d as string

		makeMarkdown({ board, filename, title, dir, markdownConfig });
	},
	async generateMermaid(inputs: InputValues): Promise<void> {
		const { a, b, c, d }: InputValues = inputs
		const board = jsonStringToBoard(a as string);

		const markdownConfig: MarkdownContentList = [MarkdownContentType.mermaid];
		const filename = b as string
		const title = c as string
		const dir = d as string

		makeMarkdown({ board, filename, title, dir, markdownConfig });
	},
});

export type MarkdownKit = InstanceType<typeof MarkdownKit>;
export { MarkdownKit }
export default MarkdownKit

// Parse json and re-construct the original board + kits
//TODO tidyup, move to util ??
function jsonStringToBoard(jsonString: string): Board {
	// parse json string 
	const json = JSON.parse(jsonString);
	// extract fields of input board from json fields
	const title = json.title
	const description = json.description
	const version = json.version
	const edges = json.edges as Edge[]
	const nodes = json.nodes
	const kits = json.kits
	// reconstruct board 
	const board = new Board({
		title: title,
		description: description,
		version: version,
	});
	// add edges back to board
	edges.forEach(function (edge: Edge) {
		board.addEdge(edge);
	})
	// add nodes back to board
	nodes.forEach(function (node: { id: string; type: string; configuration: NodeConfiguration; }) {
		const id = node.id;
		const type = node.type;
		const configuration = node.configuration;
		const descriptor: NodeDescriptor = { id, type, configuration };

		board.addNode(descriptor);
	})
	// add kits back to board
	kits.forEach(function (kit: { url: string; title: string; description: string; version: string; }) {
		const url = kit.url
		const title = kit.title
		const description = kit.description
		const version = kit.version

		const kitBuilderOptions: KitBuilderOptions = { url, title, description, version };
		// functions of the kit don't matter, we just need to populate the kit field in the markdown
		const boardKit = new KitBuilder(kitBuilderOptions).build({});

		board.addKit(boardKit);
	});

	return board
}
