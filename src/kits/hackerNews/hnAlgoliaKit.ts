import { InputValues, OutputValues } from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";

export type Item = {
	author: string;
	created_at: string;
	created_at_i: number;
	id: number;
	children: Comment[];
	story_id: number;
	type: string;
};

export type Comment = Item & {
	parent_id: number;
	text: string;
	title: null;
};

export type Story = Item & {
	title: string
	points: number
	url: string
};

export const HackerNewsAlgoliaKit = new KitBuilder({
	url: "npm:@exadev/breadboard-kits/kits/hackerNews/hnAlgoliaKit",
}).build({
	getStory: async (
		inputs: InputValues
	): Promise<OutputValues & Story> => {
		const id = inputs.id;
		const url = `https://hn.algolia.com/api/v1/items/${id}`;
		// return {url}
		const response = await fetch(url);
		const story: Story = await response.json() as unknown as Story;
		return Promise.resolve({
			algoliaUrl: url,
			...story
		})
	}
});

export type HackerNewsAlgoliaKit = InstanceType<typeof HackerNewsAlgoliaKit>;
export default HackerNewsAlgoliaKit
