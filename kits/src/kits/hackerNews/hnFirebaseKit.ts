import { InputValues, NodeValue, OutputValues } from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";

export const HackerNewsFirebaseKit = new KitBuilder({
	url: "npm:@exadev/breadboard-kits/kits/hackerNews/hnFirebaseKit",
}).build({
	topStoryIds: async (
		inputs: InputValues & { limit?: number }
	): Promise<OutputValues & { storyIds: NodeValue & number[] }> => {
		const url = "https://hacker-news.firebaseio.com/v0/topstories.json";
		const response = await fetch(url);
		const storyIds = (await response.json()) as number[];
		return {
			storyIds: inputs.limit ? storyIds.slice(0, inputs.limit) : storyIds,
		};
	},
});
export type HackerNewsFirebaseKitType = InstanceType<
	typeof HackerNewsFirebaseKit
>;

export type HackerNewsFirebaseKit = InstanceType<typeof HackerNewsFirebaseKit>;
export default HackerNewsFirebaseKit;
