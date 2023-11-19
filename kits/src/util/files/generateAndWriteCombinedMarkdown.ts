import { Board } from "@google-labs/breadboard";
import generateCombinedMarkdown from "./generateCombinedMarkdown.js";
import writeCombinedMarkdown from "./writeCombinedMarkdown.js";

export default function generateAndWriteCombinedMarkdown(
	board: Board,
	name = board.title,
	dir = ""
) {
	if (!name) {
		throw new Error("Board must have a title or a name must be suplied");
	}

	const markdownTemplate = generateCombinedMarkdown(board, name);
	writeCombinedMarkdown(dir, name, markdownTemplate);
}

export { generateAndWriteCombinedMarkdown };
