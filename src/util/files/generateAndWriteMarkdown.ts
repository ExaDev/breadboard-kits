import { Board } from "@google-labs/breadboard";
import { generateMarkdown, writeMarkdown } from "./index.js";

export default function generateAndWriteMarkdown(dir: string, name: string, board: Board) {
	const markdown = generateMarkdown(board);
	writeMarkdown(dir, name, markdown);
}
