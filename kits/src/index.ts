import {
	InputValues,
	KitConstructor,
	NodeValue,
} from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";

const ListKit = new KitBuilder({
	url: "npm:@exadev/breadboard-kits/list",
}).build({
	concat: async (
		inputs: InputValues & { a: NodeValue[]; b: NodeValue[] }
	): Promise<void | Partial<Record<string, NodeValue>>> => {
		const { a, b } = inputs;
		return { list: a.concat(b) };
	},
	split: async (
		inputs: InputValues & { list: NodeValue[]; index: number }
	): Promise<InputValues & { before: NodeValue[]; after: NodeValue[] }> => {
		const { list, index } = inputs;
		return {
			before: list.slice(0, index),
			after: list.slice(index),
		};
	},
	push: async (
		inputs: InputValues & { list: NodeValue[]; item: NodeValue }
	): Promise<void | Partial<Record<string, NodeValue>>> => {
		const { list, item } = inputs;
		list.push(item);
		return { list };
	},
	shift: async (
		inputs: InputValues & { list: NodeValue[] }
	): Promise<InputValues & { item: NodeValue; list: NodeValue[] }> => {
		const { list } = inputs;
		const item = list.shift();
		return { item, list };
	},
	pop: async (
		inputs: InputValues & { list: NodeValue[] }
	): Promise<InputValues & { item: NodeValue; list: NodeValue[] }> => {
		const { list } = inputs;
		const item = list.pop();
		return { item, list };
	},
	unshift: async (
		inputs: InputValues & { list: NodeValue[]; item: NodeValue }
	): Promise<void | Partial<Record<string, NodeValue>>> => {
		const { list, item } = inputs;
		list.unshift(item);
		return { list };
	},
	splice: async (
		inputs: InputValues & {
			list: NodeValue[];
			start: number;
			count: number;
			items?: NodeValue[];
		}
	): Promise<InputValues & { extracted: NodeValue[]; list: NodeValue[] }> => {
		const { list, start, count, items } = inputs;
		const extracted = list.splice(start, count, ...(items ?? []));
		return { extracted, list };
	},
});

export type ListKit = InstanceType<typeof ListKit>;
export default ListKit;
export { ListKit };
