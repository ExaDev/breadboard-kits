import { Board } from "@google-labs/breadboard";
import { generateCombinedMarkdown, writeCombinedMarkdown } from "util/files/index.js";

export default function generateAndWriteCombinedMarkdown(board: Board, name = board.title, dir = "./output") {
	if (!name) {
		throw new Error("Board must have a title or a name must be suplied");
	}

	const markdownTemplate = generateCombinedMarkdown(board, name);
	writeCombinedMarkdown(dir, name, markdownTemplate);
}
