import BoardMarkdownConfig from "./boardMarkdownConfig.js";
import generateJson from "./generateJson.js";
import writeJson from "./writeJson.js";

export default function generateAndWriteJson(
	{ dir, filename, board }: BoardMarkdownConfig
) {
	const jsonContent = generateJson(board);
	writeJson({ dir: dir, filename: filename, jsonContent: jsonContent });
}

export { generateAndWriteJson };
