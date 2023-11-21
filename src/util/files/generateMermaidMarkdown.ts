import { Board } from "@google-labs/breadboard";

export function generateMermaidMarkdown(board: Board): string {
	return board.mermaid();
}

export type generateMermaidMarkdown = typeof generateMermaidMarkdown;
export default generateMermaidMarkdown;
