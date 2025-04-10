import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { NodeHbs } from "../src/hbs/index.js";

describe("nodeHbs", () => {
	let nodeHbs: NodeHbs;
	const testDir = join(process.cwd(), "test-views");

	beforeEach(() => {
		// Create test directory structure
		mkdirSync(testDir, { recursive: true });
		mkdirSync(join(testDir, "partials"), { recursive: true });
		mkdirSync(join(testDir, "layouts"), { recursive: true });

		// Create test templates
		writeFileSync(join(testDir, "test.hbs"), "Hello {{name}}!");
		writeFileSync(join(testDir, "partials", "header.hbs"), "<header>Header</header>");
		writeFileSync(join(testDir, "layouts", "main.hbs"), "<div>{{mainSlot}}</div>");

		nodeHbs = new NodeHbs({
			viewsPath: testDir,
			globalData: { siteName: "Test Site" },
		});
	});

	it("should render template with data", () => {
		const result = nodeHbs.render("test", { name: "World" });
		expect(result).toBe("Hello World!");
	});

	it("should render with layout", () => {
		const result = nodeHbs.render("test", { name: "World" }, "main");
		expect(result).toBe("<div>Hello World!</div>");
	});

	it("should register helper", () => {
		nodeHbs.registerHelper("uppercase", (str: string) => str.toUpperCase());
		const result = nodeHbs.render("test", { name: "World" });
		expect(result).toBe("Hello WORLD!");
	});

	it("should get registered partials", () => {
		const partials = nodeHbs.getRegisteredPartialNames();
		expect(partials).toContainEqual({ path: join(testDir, "partials", "header.hbs"), name: "header" });
	});
});
