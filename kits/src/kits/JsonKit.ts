import { InputValues, NodeValue, OutputValues } from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";

const JsonKit = new KitBuilder({
	url: "npm:@exadev/breadboard-kits/kits/JsonKit",
}).build({
	stringify: async (
		inputs: InputValues & { object: string }
	): Promise<OutputValues> => {
		const { object } = inputs;
		return Promise.resolve({
			json: JSON.stringify(object),
		});
	},
	parse: async (
		inputs: InputValues & { json: string }
	): Promise<OutputValues> => {
		const { json } = inputs;
		return Promise.resolve(JSON.parse(json) as Record<string, NodeValue>);
	},
});

type JsonKit = InstanceType<typeof JsonKit>;
export { JsonKit };
export default JsonKit;
