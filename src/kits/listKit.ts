import { InputValues, NodeValue, OutputValues } from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { basename } from "path/posix";
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
	/**
	 * Combines lists together
	 * This method returns a and b combined as a new array
	 * @param inputs.a a list to combine
	 * @param inputs.b a list to combine to the first list
	 */
	concat: async (inputs: ListConcatInput): Promise<ListInput> => {
		const { a, b }: ListConcatInput = inputs;
		return { list: a.concat(b) };
	},
	/**
	 * Slices a list into two sections.
	 * This method returns two list.
	 * @param inputs.list the list to be split
	 * @param inputs.index the beginning index of the specified portion of the list
	 */
	bifurcate: async (inputs: ListIndexInput): Promise<BifurcatedList> => {
		const { list, index }: ListIndexInput = inputs;
		return {
			before: list.slice(0, index),
			after: list.slice(index),
		};
	},
	/**
	 * Appends a new element to the end of a list.
	 * This method returns the modified list with the new element.
	 * @param inputs.list the list to append a new element to
	 * @param inputs.item the element to be appended to the list
	 *
	 */
	push: async (inputs: ListItemInput): Promise<ListInput> => {
		const { list, item }: ListItemInput = inputs;
		list.push(item);
		return { list };
	},
	/**
	 * Removes the first element in the list.
	 * This method returns the modified list and the removed element.
	 * @param inputs.list the list the last element will be removed from.
	 */
	shift: async (inputs: ListInput): Promise<ListOperationOutput> => {
		const { list }: ListInput = inputs;
		const item: NodeValue = list.shift();
		return { item, list };
	},
	/**
	 * Removes the last element in a list.
	 * This method returns the modified list and the removed element.
	 * @param inputs.list list the list the last element will be removed from.
	 */
	pop: async (
		inputs: InputValues
	): Promise<
		| OutputValues &
		(
			| EmptyObject
			| {
				item: NodeValue;
				list: NodeValue[];
			})
	> => {
		if (!inputs.list || !Array.isArray(inputs.list) && (Array.isArray(inputs.list) && inputs.list.length == 0)) {
			return {};
		}
		const list: NodeValue[] = inputs.list as NodeValue[];
		const item: NodeValue = list.pop();
		return { item, list };
	},
	/**
	 * Appends a new element at the start of the list
	 * This method returns the modified list with the new element.
	 * @param inputs.list the list the new element will be added to.
	 * @param inputs.item the element to appended to the list.
	 */
	unshift: async (inputs: ListItemInput): Promise<ListOutput> => {
		const { list, item }: ListItemInput = inputs;
		list.unshift(item);
		return { list };
	},
	/**
	 * Removes elements from a list. If provided, replaces removed elements with new elements in their place.
	 * This method returns a list with the rmodified list which has removed or replaced elements.
	 * @param inputs.list the list to be modified
	 * @param inputs.start the index of array from which to start removing elements.
	 * @param inputs.count the number of elements to remove.
	 * @param inputs.items the elements to replace the removed elements.
	 *
	 */
	splice: async (inputs: ListSpliceInput): Promise<ListSpliceOutput> => {
		const { list, start, count, items }: ListSpliceInput = inputs;
		const extracted: NodeValue[] = list.splice(
			start,
			count,
			...(items ?? [])
		);
		return { extracted, list };
	},
	/**
	 * Splits a string into substrings using the specified delimiter.
	 * This method returns a list containing substrings of the original string.
	 * @param inputs.input the string to split
	 * @param inputs.delimiter the separator to split a string by
	 * @param inputs.split_by_each flag which splits substrings into their individual characters
	 * @param inputs.remove_empty_text flag whichs removes empty strings
	 * @param inputs.trim_items flag which removes leading and trailing whitespace and line terminator characters
	 * @param inputs.keep_delimiters flag which returns the substrings including the separator
	 * @param inputs.output_format the format of the result
	 * @returns
	 */
	split: async (inputs: SplitInput): Promise<SplitOutput> => {
		const {
			input,
			delimiter,
			split_by_each,
			remove_empty_text,
			trim_items,
			keep_delimiters,
			output_format = "string_array",
		}: SplitInput = inputs;
		let values: (string | { text: string; delimiter: string; })[]

		if(delimiter.regex != null) {
			// if it's a regex string, convert back to RegEx
			// have to do this because nodeValues does not support RegEx Type
			const myRegex = new RegExp(delimiter.regex)
			values = input.split(myRegex)
		} else {
			values = input.split(delimiter.delimiter)
		}

		values = values.map((text: string) => {
			if (split_by_each) {
				return text.split("");
			}
			return text;
		}).flat();

		if (remove_empty_text) {
			// have to re-assign the new list
			values = values.filter((text: string) => text.length > 0);
		}
		if (trim_items) {
			values = values.map((text: string) => text.trim());
		}
		// TODO add logic for when it is regular expression
		// it's probabably going to be easier and neater to do this BEFORE the split occurs
		// so we would convert into a special RegEx so we don't have to concat
		// anything back on. Can't concat with RegEx because it can match many things
		if (keep_delimiters && delimiter.delimiter != null) {
			// remove last element, because it wouldn't have had a delimiter
			const tmp = values.slice(0,-1)
			const removed = values[values.length-1]
			// for all other elements, append the original delimiter back 
			values = tmp.map((text: string) => text.concat(delimiter.delimiter))
			values.push(removed)
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
