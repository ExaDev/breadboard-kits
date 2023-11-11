import { KitBuilder } from "@google-labs/breadboard/kits";
import {
	ListConcatInput,
	ListIndexInput,
	ListInput,
	ListItemInput,
	ListOperationOutput,
	ListOutput,
	ListSplicOutput,
	ListSpliceInput,
	SplitListOutput,
} from "index.js";

const ListKit = new KitBuilder({
	url: "npm:@exadev/breadboard-kits/list",
}).build({
	/* eslint-disable @typescript-eslint/require-await */
	concat: async (inputs: ListConcatInput): Promise<ListInput> => {
		const { a, b } = inputs;
		return { list: a.concat(b) };
	},
	split: async (inputs: ListIndexInput): Promise<SplitListOutput> => {
		const { list, index } = inputs;
		return {
			before: list.slice(0, index),
			after: list.slice(index),
		};
	},
	push: async (inputs: ListItemInput): Promise<ListInput> => {
		const { list, item } = inputs;
		list.push(item);
		return { list };
	},
	shift: async (inputs: ListInput): Promise<ListOperationOutput> => {
		const { list } = inputs;
		const item = list.shift();
		return { item, list };
	},
	pop: async (inputs: ListInput): Promise<ListOperationOutput> => {
		const { list } = inputs;
		const item = list.pop();
		return { item, list };
	},
	unshift: async (inputs: ListItemInput): Promise<ListOutput> => {
		const { list, item } = inputs;
		list.unshift(item);
		return { list };
	},
	splice: async (inputs: ListSpliceInput): Promise<ListSplicOutput> => {
		const { list, start, count, items } = inputs;
		const extracted = list.splice(start, count, ...(items ?? []));
		return { extracted, list };
	},
	/* eslint-enable @typescript-eslint/require-await */
});

export type ListKit = InstanceType<typeof ListKit>;
export default ListKit;
