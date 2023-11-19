import { InputValues } from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";

export function parametersFromTemplate(template: string): string[] {
	const matches = template.matchAll(/{{(?<name>[\w-]+)}}/g);
	const parameters = Array.from(matches).map(
		(match) => match.groups?.name || ""
	);
	return Array.from(new Set(parameters));
}

export const stringify = (value: unknown): string => {
	if (typeof value === "string") return value;
	if (value === undefined) return "undefined";
	return JSON.stringify(value, null, 2);
};

export function substitute(template: string, values: InputValues) {
	return Object.entries(values).reduce(
		(acc, [key, value]) => acc.replace(`{{${key}}}`, stringify(value)),
		template
	);
}

const StringKit = new KitBuilder({
	url: "npm:@exadev/breadboard-kits/kits/StringKit",
}).build({
	concat: async (inputs: {
		strings: string[];
	}): Promise<{ string: string; }> => {
		const { strings } = inputs;
		return Promise.resolve({
			string: strings.join(""),
		});
	},
	template: async (inputs: {
		template: string;
		values: Record<string, string>;
	}): Promise<{ string: string; }> => {
		const template = inputs.template;
		const parameters = parametersFromTemplate(template);

		if (!parameters.length) return { string: template };

		const substitutes = parameters.reduce((acc, parameter) => {
			if (inputs[parameter] === undefined)
				throw new Error(`Input is missing parameter "${parameter}"`);
			return { ...acc, [parameter]: inputs[parameter] };
		}, {});

		const string = substitute(template, substitutes);
		// log.info(`Prompt: ${prompt}`);
		return Promise.resolve({ string });
	},
});

type StringKit = InstanceType<typeof StringKit>;
export { StringKit };
export default StringKit;
