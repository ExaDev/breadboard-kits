export type MarkdownConfig = {
	mermaidMarkdown: boolean,
	jsonMarkdown: boolean,
	combined: boolean;
};

export enum MarkdownContentType {
	mermaid,
	json,
	combined
}

export type MarkdownContentList = MarkdownContentType[];
