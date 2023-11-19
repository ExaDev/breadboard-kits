import { Board } from "@google-labs/breadboard";

export default function generateMermaidMarkdown(board: Board) {
	return `\`\`\`mermaid\n${board.mermaid()}\n\`\`\``;
}
export { generateMermaidMarkdown };
