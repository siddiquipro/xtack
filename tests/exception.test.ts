import { describe, expect, it } from "vitest";
import { Exception } from "../src/exception/index.js";

describe("exception", () => {
	it("should create exception with default status", () => {
		const error = new Exception("Test error");
		expect(error.message).toBe("Test error");
		expect(error.status).toBe(500);
	});

	it("should create exception with custom status", () => {
		const error = new Exception("Not found", 404);
		expect(error.message).toBe("Not found");
		expect(error.status).toBe(404);
	});

	it("should be instance of Error", () => {
		const error = new Exception("Test error");
		expect(error).toBeInstanceOf(Error);
	});
});
