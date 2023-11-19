import fs from "fs";
import path from "path";

export default function writeCombinedMarkdown(
	{
		dir = "",
		filename,
		markdownTemplate
	}: { dir: string, filename: string, markdownTemplate: string; }
) {
	const mdFilepath = path.resolve(path.join(dir, `${filename}.md`));
	fs.mkdirSync(path.dirname(mdFilepath), { recursive: true });
	fs.writeFileSync(mdFilepath, markdownTemplate);
	console.log("wrote", `"${mdFilepath}"`);
}

export { writeCombinedMarkdown };
