import { Board } from "@google-labs/breadboard";

export default function generateJson(board: Board): string {
	return JSON.stringify(board, null, "\t");
}
export { generateJson };
