import { Board } from "@google-labs/breadboard";
import generateMermaidMarkdown from "./generateMermaidMarkdown.js";
import writeMarkdown from "./writeMarkdown.js";

export default function generateAndWriteMermaidMarkdown(
	{
		dir = "", filename, board, title = board.title
	}: { dir: string, filename: string, board: Board; title?: string; }
) {
	writeMarkdown({
		dir,
		filename,
		markdown: generateMermaidMarkdown({
			board,
			title
		})
	});
}
export { generateAndWriteMermaidMarkdown };
