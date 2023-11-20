import fs from "fs";
import path from "path";

export default function writeMarkdown(
	{
		dir,
		filename,
		markdown
	}: { dir?: string, filename: string, markdown: string; }
) {
	const mdFilepath = path.resolve(path.join(dir, `${filename}.md`));
	fs.mkdirSync(path.dirname(mdFilepath), { recursive: true });
	fs.writeFileSync(mdFilepath, markdown);
	console.log("wrote", `"${mdFilepath}"`);
}

export { writeMarkdown };
