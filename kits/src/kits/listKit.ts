import { InputValues, NodeValue, OutputValues } from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";
import {
	BifurcatedList,
	ListConcatInput,
	ListIndexInput,
	ListInput,
	ListItemInput,
	ListOperationOutput,
	ListOutput,
	ListSpliceInput,
	ListSpliceOutput,
	SplitInput,
	SplitOutput,
} from "types/list.js";

type EmptyObject = Record<string, never>;

export const ListKit = new KitBuilder({
	url: "npm:@exadev/breadboard-kits/list",
}).build({
	/* eslint-disable @typescript-eslint/require-await */
	concat: async (inputs: ListConcatInput): Promise<ListInput> => {
		const { a, b }: ListConcatInput = inputs;
		return { list: a.concat(b) };
	},
	bifurcate: async (inputs: ListIndexInput): Promise<BifurcatedList> => {
		const { list, index }: ListIndexInput = inputs;
		return {
			before: list.slice(0, index),
			after: list.slice(index),
		};
	},
	push: async (inputs: ListItemInput): Promise<ListInput> => {
		const { list, item }: ListItemInput = inputs;
		list.push(item);
		return { list };
	},
	shift: async (inputs: ListInput): Promise<ListOperationOutput> => {
		const { list }: ListInput = inputs;
		const item: NodeValue = list.shift();
		return { item, list };
	},
	pop: async (
		inputs: InputValues &
		(
			| {
				list: NodeValue[];
			} | {
				list: [];
			}
		)
	): Promise<
		| OutputValues &
		(
		| EmptyObject
		| {
			item: NodeValue;
			list: NodeValue[];
		})
		> => {
		if (!inputs.list || inputs.list == undefined || inputs.list.length == 0) {
			return {};
		}
		const { list } = inputs;
		const item: NodeValue = list.pop();
		return { item, list };
	},
	unshift: async (inputs: ListItemInput): Promise<ListOutput> => {
		const { list, item }: ListItemInput = inputs;
		list.unshift(item);
		return { list };
	},
	splice: async (inputs: ListSpliceInput): Promise<ListSpliceOutput> => {
		const { list, start, count, items }: ListSpliceInput = inputs;
		const extracted: NodeValue[] = list.splice(
			start,
			count,
			...(items ?? [])
		);
		return { extracted, list };
	},
	split: async (inputs: SplitInput): Promise<SplitOutput> => {
		const {
			input,
			delimiter,
			trim,
			split_by_each,
			remove_empty_text,
			trim_items,
			keep_delimiters,
			output_format = "string_array",
		}: SplitInput = inputs;
		const values: (string | { text: string; delimiter: string; })[] = input
			.split(delimiter)
			.map((text: string) => {
				if (trim) {
					text = text.trim();
				}
				if (split_by_each) {
					return text.split("");
				}
				return text;
			})
			.flat();
		if (remove_empty_text) {
			values.filter((text: string) => text.length > 0);
		}
		if (trim_items) {
			values.map((text: string) => text.trim());
		}
		if (keep_delimiters) {
			values.map((text: string) => {
				return { text, delimiter };
			});
		}
		if (output_format === "string_array") {
			return { values: values as string[] };
		}
		return { values: values as { text: string; delimiter: string; }[] };
	},
	/* eslint-enable @typescript-eslint/require-await */
});

export type ListKit = InstanceType<typeof ListKit>;
export default ListKit;
