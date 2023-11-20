import { Board } from "@google-labs/breadboard";

export default function generateMermaidMarkdown(board: Board): string {
	return board.mermaid();
}
export { generateMermaidMarkdown };
