import { describe, expect, it } from "vitest";

import app from "../src/index";

describe("first test", () => {
	it("should return hello", async () => {
		// write test to
		const result = app.greet("world");
		expect(result).toBe("Hello, world!");
	});
});
