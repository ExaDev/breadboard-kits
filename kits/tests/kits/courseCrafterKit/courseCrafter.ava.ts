import { Board } from "@google-labs/breadboard";
import test from "ava";
import fs from "fs";
import CourseCrafterKit from "../../../src/kits/courseCrafter/CourseCrafterKit.js"

test("courseCrafterKit.getContent", async (t) => {
	const board = new Board({
		title: "Course Crafter Kit",
		description: "Course Crafter Kit Test",
		version: "0.0.1",
	});
	const courseCraftKit = board.addKit(CourseCrafterKit)

	const input = board.input({
		$id: "board",
		schema: {
			type: "object",
			properties: {
				text: {
					type: "string",
					title: "Text",
					description: "urls",
				},
			},
		},
	});

	const getContent = courseCraftKit.getContent()
	const output = board.output()

	input.wire("->url", getContent)
	getContent.wire("title->", output)
	getContent.wire("blog->", output)

	const blogURL = "https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial/"
	const blogURL2 = "https://developer.chrome.com/blog/automatic-picture-in-picture/"
	const blogURL3 = "https://developer.chrome.com/blog/third-party-cookie-deprecation-trial/"

	const blogContents = []

	const result = await board.runOnce({
		url: blogURL
	})
	blogContents.push({ url: blogURL, title: result["title"], blog: result["blog"] })

	const result2 = await board.runOnce({
		url: blogURL2
	})
	blogContents.push({ url: blogURL2, title: result2["title"], blog: result2["blog"] })

	const result3 = await board.runOnce({
		url: blogURL3
	})
	blogContents.push({ url: blogURL3, title: result3["title"], blog: result3["blog"] })

	// then maybe feed to this to xenova to get a summary
	fs.writeFileSync("./tests/kits/courseCrafterKit/output.json", JSON.stringify(blogContents, null, 2));

	t.is(true, true);
});
