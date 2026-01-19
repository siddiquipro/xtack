import { beforeEach, describe, expect, it } from "vitest";
import { Session } from "../src/session/index.js";
import { MockCookieFetcher } from "./mocks/cookie-fetcher.js";

describe("session", () => {
	let session: Session;
	let cookieFetcher: MockCookieFetcher;

	beforeEach(() => {
		cookieFetcher = new MockCookieFetcher();
		session = new Session({
			secret: "test-secret-random-key-for-encryption",
			ageInSeconds: 3600,
			cookie: cookieFetcher,
		});
		session.initiate();
	});

	it("should store and retrieve values", () => {
		session.put("test", "value");
		expect(session.get("test")).toBe("value");
	});

	it("should check if key exists", () => {
		session.put("test", "value");
		expect(session.has("test")).toBe(true);
		expect(session.has("non-existent")).toBe(false);
	});

	it("should remove values", () => {
		session.put("test", "value");
		session.forget("test");
		expect(session.has("test")).toBe(false);
	});

	it("should pull values", () => {
		session.put("test", "value");
		const value = session.pull("test", null);
		expect(value).toBe("value");
		expect(session.has("test")).toBe(false);
	});

	it("should handle numeric values", () => {
		session.put("counter", 5);
		session.increment("counter");
		expect(session.get("counter")).toBe(6);
		session.decrement("counter");
		expect(session.get("counter")).toBe(5);
	});

	it("should handle flash messages", () => {
		session.flash("message", "Hello");
		session.commit();

		// Re-initiate session to read flash messages
		const newSession = new Session({
			secret: "test-secret-random-key-for-encryption",
			ageInSeconds: 3600,
			cookie: cookieFetcher,
		});
		newSession.initiate();

		// Flash messages can be read multiple times within the same request
		expect(newSession.getFlash("message")).toBe("Hello");
		expect(newSession.getFlash("message")).toBe("Hello");

		// But should be gone after next commit/initiate cycle
		newSession.commit();
		const thirdSession = new Session({
			secret: "test-secret-random-key-for-encryption",
			ageInSeconds: 3600,
			cookie: cookieFetcher,
		});
		thirdSession.initiate();
		expect(thirdSession.getFlash("message")).toBeUndefined();
	});

	it("should clear all values", () => {
		session.put("test1", "value1");
		session.put("test2", "value2");
		session.clear();
		expect(session.has("test1")).toBe(false);
		expect(session.has("test2")).toBe(false);
	});

	it("should get all values", () => {
		session.put("test1", "value1");
		session.put("test2", "value2");
		const all = session.all();
		expect(all.test1).toBe("value1");
		expect(all.test2).toBe("value2");
		// Session also includes __id__ key
		expect(all).toHaveProperty("__id__");
	});
});
