import { Board } from "@google-labs/breadboard";
import generateJson from "./generateJson.js";
import writeJson from "./writeJson.js";

export default function generateAndWriteJson(
	{ dir, filename, board }: { dir: string, filename: string, board: Board; }
) {
	const jsonContent = generateJson(board);
	writeJson({ dir: dir, filename: filename, jsonContent: jsonContent });
}

export { generateAndWriteJson };
