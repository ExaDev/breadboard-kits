/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { KitBuilder } from "@google-labs/breadboard/kits";
import { InputValues, NodeValue, OutputValues} from "@google-labs/breadboard";

import {TransformerTask} from "../../types/xenova.js"
import axios from "axios";
import * as cheerio from "cheerio";

type Blog = {
	url: NodeValue;
	title: NodeValue;
	blog: NodeValue;
}

export type Blogs = {
	blogs: Blog[]
}

async function getBlogContent(url: string): Promise<Blog> {
	const axiosInstance = axios.create()

	const response = await axiosInstance.get(url, {
		headers: {
			"Accept-Encoding": "application/json",
		}
	})
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const selector = cheerio.load(response.data)
	// hard to extract data from other blogs that don't follow the structure of https://developer.chrome.com/blog blogs
	console.log(`Extracting Content from: ${url}`)
	const title : NodeValue = selector(".devsite-page-title").text()
	// blog body
	// if this stops returning content, inspect css, the class names might have changed
	const blog : NodeValue = selector(".devsite-article-body").text()

	return Promise.resolve({ url, title, blog })
}

export const CourseCrafterKit = new KitBuilder({
	url: "npm@exadev/breadboard-kits/CourseCrafter"
}).build({
	async getContent(input: InputValues & {
		url: string
	}): Promise<Blog> {
		const { url }: InputValues = input

		return getBlogContent(url)
	},
	// TODO refactor to allow multiple urls 

	async getBlogContentForTask(
		inputs: InputValues & {
			url?: string;
			model?: string;
			task?: TransformerTask;
		}): Promise<OutputValues> {
		const{url, model, task} : InputValues = inputs 

		const response = await getBlogContent(url)
	
		return { blogContent:response["blog"], model, task }
	}

});

export type CourseCrafterKit = InstanceType<typeof CourseCrafterKit>;
export default CourseCrafterKit;
