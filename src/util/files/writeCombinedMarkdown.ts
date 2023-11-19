import fs from "fs";
import path from "path";

export default function writeCombinedMarkdown(
	dir: string,
	name: string,
	markdownTemplate: string
) {
	const mdFilepath = path.resolve(path.join(dir, "markdown", `${name}.md`));
	fs.mkdirSync(path.dirname(mdFilepath), { recursive: true });
	fs.writeFileSync(mdFilepath, markdownTemplate);
	console.log("wrote", `"${mdFilepath}"`);
}

export { writeCombinedMarkdown };
