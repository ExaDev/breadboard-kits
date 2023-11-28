/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { KitBuilder } from "@google-labs/breadboard/kits";
import { InputValues, NodeValue} from "@google-labs/breadboard";
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

export const CourseCrafterKit = new KitBuilder({
	url: "npm@exadev/breadboard-kits/CourseCrafter"
}).build({
	// TODO, modify this to allow more than one blog to be extracted
	async getContent(input: InputValues & {
		url: string
	}): Promise<Blog> {
		const { url }: InputValues = input
		const axiosInstance = axios.create()

		const response = await axiosInstance.get(url, {
			headers: {
				"Accept-Encoding": "application/json",
			}
		})
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const selector = cheerio.load(response.data)

		console.log(`Extracting Content from: ${url}`)
		// could provide these class names as param, so as long as we know the class names, we can extract anything
		// hard to extract data from other blogs that don't follow the structure of https://developer.chrome.com/blog blogs
		const title : NodeValue = selector(".flow-space-200>h1").text()
		// blog body
		const blog : NodeValue = selector(".center-images").text()
	
		return Promise.resolve({ url, title, blog })
	}
});

export type CourseCrafterKit = InstanceType<typeof CourseCrafterKit>;
export default CourseCrafterKit;
