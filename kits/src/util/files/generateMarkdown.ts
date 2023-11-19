import { Board } from "@google-labs/breadboard";

export default function generateMarkdown(board: Board) {
	return `\`\`\`mermaid\n${board.mermaid()}\n\`\`\``;
}
export { generateMarkdown };
