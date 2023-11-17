import { Board } from "@google-labs/breadboard";
import generateJson from "./generateJson.js";
import writeJson from "./writeJson.js";

export default function generateAndWriteJson(
	dir: string,
	name: string,
	board: Board
) {
	const jsonContent = generateJson(board);
	writeJson(dir, name, jsonContent);
}
