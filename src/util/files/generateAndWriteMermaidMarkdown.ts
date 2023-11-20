import { BoardMarkdownConfig } from "../files/boardMarkdownConfig.js";
import generateMermaidMarkdown from "./generateMermaidMarkdown.js";
import writeMarkdown from "./writeMarkdown.js";

export default function generateAndWriteMermaidMarkdown(
	{
		dir, filename, board
	}: BoardMarkdownConfig
) {
	writeMarkdown({
		dir,
		filename,
		markdown: generateMermaidMarkdown(
			board,
		)
	});
}
export { generateAndWriteMermaidMarkdown };
