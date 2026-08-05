import { beforeEach, describe, expect, it } from "vitest";
import { Session } from "../src/session/index.js";
import { CsrfShield } from "../src/shield/index.js";
import { MockCookieFetcher } from "./mocks/cookie-fetcher.js";

describe("shield", () => {
	let session: Session;
	let cookieFetcher: MockCookieFetcher;
	let requestMethod = "GET";
	let requestToken = "";
	let responseToken = "";

	beforeEach(() => {
		cookieFetcher = new MockCookieFetcher();
		session = new Session({
			secret: "test-secret-random-key-for-encryption",
			ageInSeconds: 3600,
			cookie: cookieFetcher,
		});
		session.initiate();
		requestMethod = "GET";
		requestToken = "";
		responseToken = "";
	});

	function createShield(throwOnFailure = true): CsrfShield {
		return new CsrfShield({
			session,
			throwOnFailure,
			getRequestMethod: async () => requestMethod,
			getCsrfTokenFromBody: async () => requestToken,
			setCsrfToken: async (token) => {
				responseToken = token;
			},
		});
	}

	it("should generate token", async () => {
		const shield = createShield();
		await expect(shield.handle()).resolves.toBe(true);
		expect(responseToken).toContain(".");
	});

	it("should throw on invalid token by default", async () => {
		const shield = createShield();
		await shield.handle();

		requestMethod = "POST";
		requestToken = "invalid";
		await expect(shield.handle()).rejects.toThrow("Invalid CSRF token");
	});

	it("should return false on invalid token when throwOnFailure is false", async () => {
		const shield = createShield(false);
		await shield.handle();

		requestMethod = "POST";
		requestToken = "invalid";
		await expect(shield.handle()).resolves.toBe(false);
	});
});
