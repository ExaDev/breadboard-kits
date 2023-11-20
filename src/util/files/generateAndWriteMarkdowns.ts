import { Board } from "@google-labs/breadboard";
import { MarkdownConfig } from "../../types/markdown.js";
import { generateAndWriteCombinedMarkdown } from "./generateAndWriteCombinedMarkdown.js";
import { generateAndWriteJson } from "./generateAndWriteJson.js";
import { generateAndWriteMermaidMarkdown } from "./generateAndWriteMermaidMarkdown.js";
import { writeFiles } from "./writeFiles.js";

export default function generateAndWriteMarkdowns(
	{ board, filename, title, dir, markdownConfig }: {
		board: Board,
		filename: string,
		title: string,
		dir: string,
		markdownConfig: MarkdownConfig;
	}
) {
	if (markdownConfig.mermaidMarkdown && !markdownConfig.jsonMarkdown) {
		generateAndWriteMermaidMarkdown({ dir, filename, board, title });
	} else if (markdownConfig.jsonMarkdown && !markdownConfig.mermaidMarkdown) {
		generateAndWriteJson({ dir, filename, board });
	} else if (markdownConfig.jsonMarkdown && markdownConfig.mermaidMarkdown) {
		if (markdownConfig.combined) {
			generateAndWriteCombinedMarkdown({ board, filename, title, dir });
		} else {
			writeFiles(board, filename, dir);
		}
	} else {
		throw new Error("generateAndWriteMarkdowns Error: markdownConfig configured to generate no markdowns");
	}
}

export { generateAndWriteMarkdowns };
