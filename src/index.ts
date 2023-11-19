import * as files from "./util/files/index.js";
const util = {
	files,
};
export { util };

import * as list from "./types/list.js";
const types = {
	list,
};
export { types };

export * as ListKit from "./kits/ListKit.js";
export * as HackerNewsAlgoliaKit from "./kits/hackerNews/HackerNewsAlgoliaKit.js";
export * as HackerNewsFirebaseKit from "./kits/hackerNews/HackerNewsFirebaseKit.js";

import { ListKit } from "./kits/ListKit.js";
import { HackerNewsAlgoliaKit } from "./kits/hackerNews/HackerNewsAlgoliaKit.js";
import { HackerNewsFirebaseKit } from "./kits/hackerNews/HackerNewsFirebaseKit.js";

export default {
	ListKit,
	HackerNewsAlgoliaKit,
	HackerNewsFirebaseKit,
	util,
	types,
};
