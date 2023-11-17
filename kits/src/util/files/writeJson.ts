import fs from "fs";
import path from "path";

export default function writeJson(dir: string, name: string, jsonContent: string) {
	const jsonFilePath = path.resolve(path.join(dir, "json", `${name}.json`));
	fs.mkdirSync(path.dirname(jsonFilePath), { recursive: true });
	fs.writeFileSync(jsonFilePath, jsonContent);
	console.log("wrote", `"${jsonFilePath}"`);
}
