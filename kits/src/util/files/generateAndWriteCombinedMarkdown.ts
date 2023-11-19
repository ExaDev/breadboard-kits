import { Board } from "@google-labs/breadboard";
import generateCombinedMarkdown from "./generateCombinedMarkdown.js";
import writeCombinedMarkdown from "./writeCombinedMarkdown.js";

export default function generateAndWriteCombinedMarkdown(
	{ board, filename = board.title, title = board.title, dir = "" }: {
		board: Board,
		filename?: string,
		title?: string,
		dir?: string;
	}
) {
	if (!filename) {
		throw new Error("Board must have a title or a name must be suplied");
	}

	const markdownTemplate = generateCombinedMarkdown({ board, title });
	writeCombinedMarkdown({ dir, filename, markdownTemplate });
}

export { generateAndWriteCombinedMarkdown };
