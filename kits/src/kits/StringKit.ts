import { KitBuilder } from "@google-labs/breadboard/kits";

const StringKit = new KitBuilder({
	url: "npm:@exadev/breadboard-kits/kits/StringKit",
}).build({
	concat: async (
		inputs: { strings: string[] }
	): Promise<{ string: string }> => {
		const { strings } = inputs;
		return Promise.resolve({
			string: strings.join(""),
		});
	},
	template: async (
		inputs: { template: string; values: Record<string, string> }
	): Promise<{ string: string }> => {
		const { template, values } = inputs;
		const string = template.replace(
			/\{\{([^}]+)}}/g,
			(match, key) => values[key]
		);
		return Promise.resolve({
			string,
		});
	}
})

type StringKit = InstanceType<typeof StringKit>;
export { StringKit };
export default StringKit;
