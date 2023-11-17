import fs from "fs";
import path from "path";

export default function writeMarkdown(
	dir: string,
	name: string,
	markdown: string
) {
	const mdFilepath = path.resolve(path.join(dir, "markdown", `${name}.md`));
	fs.mkdirSync(path.dirname(mdFilepath), {recursive: true});
	fs.writeFileSync(mdFilepath, markdown);
	console.log("wrote", `"${mdFilepath}"`);
}
