import { Board } from "@google-labs/breadboard";
import generateMermaidMarkdown from "./generateMermaidMarkdown.js";
import writeMarkdown from "./writeMarkdown.js";

export default function generateAndWriteMermaidMarkdown(
	{ dir = "", filename, board }: { dir: string, filename: string, board: Board; }
) {
	const markdown = generateMermaidMarkdown(board);
	writeMarkdown({ dir: dir, filename: filename, markdown: markdown });
}
export { generateAndWriteMermaidMarkdown };
