import {NodeValue} from "@google-labs/breadboard";
import { List } from "./list.js";


export type blogOutput = {
	blogContents: NodeValue;
}

export type blogList = {
	blogOutput: blogOutput[];
};


export type getBlogsHTMLContentInput = List

export type getBlogsContentForTaskOutput =  blogList

