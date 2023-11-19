import { Board } from "@google-labs/breadboard";

export default function generateJson(board: Board) {
	return JSON.stringify(board, null, "\t");
}
export { generateJson };
