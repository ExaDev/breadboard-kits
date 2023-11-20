import { Board } from "@google-labs/breadboard";

export default function generateMermaidMarkdown(
	{
		board,
		title = board.title,
	}: { title?: string, board: Board }) {
	return [
		title ? `# ${title}` : "",
		"```mermaid",
		board.mermaid(),
		"```"
	].filter(Boolean).join("\n");
}
export { generateMermaidMarkdown };
