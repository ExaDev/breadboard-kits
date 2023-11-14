import { Board } from "@google-labs/breadboard";
import fs from "fs";
import path from "path";

export function writeCombinedMarkdown(dir: string, name: string, markdownTemplate: string) {
	const mdFilepath = path.resolve(path.join(dir, "markdown", `${name}.md`));
	fs.mkdirSync(path.dirname(mdFilepath), { recursive: true });
	fs.writeFileSync(mdFilepath, markdownTemplate);
	console.log("wrote", `"${mdFilepath}"`);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function writeFiles(board: Board, name = board.title, dir = "./output") {
	if (!name) {
		throw new Error("Board must have a title or a name must be suplied");
	}

	generateAndWriteMarkdown(dir, name, board);
	generateAndWriteJson(dir, name, board);
}

export function generateAndWriteJson(dir: string, name: string, board: Board) {
	const jsonContent = generateJson(board);
	writeJson(dir, name, jsonContent);
}

export function writeJson(dir: string, name: string, jsonContent: string) {
	const jsonFilePath = path.resolve(path.join(dir, "json", `${name}.json`));
	fs.mkdirSync(path.dirname(jsonFilePath), { recursive: true });
	fs.writeFileSync(jsonFilePath, jsonContent);
	console.log("wrote", `"${jsonFilePath}"`);
}

export function generateJson(board: Board) {
	return JSON.stringify(board, null, "\t");
}

export function generateAndWriteMarkdown(dir: string, name: string, board: Board) {
	const markdown = generateMarkdown(board);
	writeMarkdown(dir, name, markdown);
}

export function writeMarkdown(dir: string, name: string, markdown: string) {
	const mdFilepath = path.resolve(path.join(dir, "markdown", `${name}.md`));
	fs.mkdirSync(path.dirname(mdFilepath), { recursive: true });
	fs.writeFileSync(mdFilepath, markdown);
	console.log("wrote", `"${mdFilepath}"`);
}

export function generateMarkdown(board: Board) {
	return `\`\`\`mermaid\n${board.mermaid()}\n\`\`\``;
}

export function generateAndWriteCombinedMarkdown(board: Board, name = board.title, dir = "./output") {
	if (!name) {
		throw new Error("Board must have a title or a name must be suplied");
	}

	const markdownTemplate = generateCombinedMarkdown(board, name);
	writeCombinedMarkdown(dir, name, markdownTemplate);
}

export function generateCombinedMarkdown(board: Board, name: string = board.title) {
	if (!name) {
		throw new Error("Board must have a title or a name must be suplied");
	}

	const markdown = generateMarkdown(board);
	const json = generateJson(board);
	const jsonCodeBlock = `\`\`\`json\n${json}\n\`\`\``;
	return `# ${name}\n\n${markdown}\n\n${jsonCodeBlock}`;
}
