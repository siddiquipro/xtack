import { describe, expect, it } from "vitest";
import { helpers } from "../src/helpers/index.js";

describe("helpers", () => {
	it("should have string helpers", () => {
		expect(helpers.string.camelCase("hello world")).toBe("helloWorld");
		expect(helpers.string.snakeCase("helloWorld")).toBe("hello_world");
	});

	it("should handle string manipulation", () => {
		expect(helpers.string.plural("test")).toBe("tests");
		expect(helpers.string.singular("tests")).toBe("test");
	});

	it("should handle string truncation", () => {
		expect(helpers.string.truncate("Hello World", 5)).toBe("Hello...");
		expect(helpers.string.excerpt("Hello World", 5)).toBe("Hello...");
	});

	it("should handle string case conversion", () => {
		expect(helpers.string.titleCase("hello world")).toBe("Hello World");
		expect(helpers.string.capitalCase("hello world")).toBe("Hello World");
	});
});
