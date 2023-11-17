import { Board } from "@google-labs/breadboard";
import generateJson from "./generateJson.js";
import generateMarkdown from "./generateMarkdown.js";

export default function generateCombinedMarkdown(
	board: Board,
	name: string | undefined = board.title
) {
	if (!name) {
		throw new Error("Board must have a title or a name must be suplied");
	}

	const markdown = generateMarkdown(board);
	const json = generateJson(board);
	const jsonCodeBlock = `\`\`\`json\n${json}\n\`\`\``;
	return `# ${name}\n\n${markdown}\n\n${jsonCodeBlock}`;
}
