import { InputValues, NodeValue, OutputValues } from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

function getAbsoluteFilePath(envPath: string = ".env"): string {
	if (!path.isAbsolute(envPath)) {
		envPath = path.join(process.cwd(), envPath);
	}
	return envPath;
}

async function readEnv(inputs: InputValues & { path?: string; }): Promise<OutputValues>{
	let envPath: string = inputs.path || ".env";

	if (inputs.path) {
		// Throw an error if the explicitly provided path does not exist
		if (!fs.existsSync(envPath)) {
			throw new Error(`Path ${envPath} does not exist`);
		}
	}
	envPath = getAbsoluteFilePath(envPath);

	dotenv.config({ path: envPath });

	return Promise.resolve({ ...process.env });
}

const ConfigKit = new KitBuilder({
	url: "npm:@exadev/breadboard-kits/kits/ConfigKit",
}).build({
	readEnv,
	readEnvVar: async function (inputs: InputValues & { key: string, path?: string; }): Promise<OutputValues & {
		[key: string]: NodeValue;
	}> {
		const env = await readEnv(inputs);
		const key = inputs.key;
		const value = env[key];
		if (value === undefined) {
			const absolutePath = getAbsoluteFilePath(inputs.path);
			throw new Error(`Key "${key}" not found in "${absolutePath}"`);
		}
		return Promise.resolve({ [key]: env[key] });
	},
});

type ConfigKit = InstanceType<typeof ConfigKit>;
export { ConfigKit };
export default ConfigKit;
