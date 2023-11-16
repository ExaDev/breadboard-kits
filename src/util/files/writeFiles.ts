import { Board } from "@google-labs/breadboard";
import { generateAndWriteJson, generateAndWriteMarkdown } from "./index.js";

export default function writeFiles(board: Board, name = board.title, dir = "./output") {
	if (!name) {
		throw new Error("Board must have a title or a name must be suplied");
	}

	generateAndWriteMarkdown(dir, name, board);
	generateAndWriteJson(dir, name, board);
}
