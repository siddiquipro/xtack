import { beforeEach, describe, expect, it } from "vitest";
import { Auth } from "../src/auth/index.js";
import { Session } from "../src/session/index.js";
import { MockCookieFetcher } from "./mocks/cookie-fetcher.js";

interface User {
	id: number;
	name: string;
}

describe("auth", () => {
	let auth: Auth<User>;
	let session: Session;
	let cookieFetcher: MockCookieFetcher;
	const mockUser: User = { id: 1, name: "Test User" };

	beforeEach(() => {
		cookieFetcher = new MockCookieFetcher();
		session = new Session({
			secret: "test-secret-which-must-be-32-characters-long",
			ageInSeconds: 3600,
			cookie: cookieFetcher,
		});
		session.initiate();

		const fetchUser = async (id: number | string) => {
			if (id === mockUser.id)
				return mockUser;
			return null;
		};

		auth = new Auth(session, fetchUser);
	});

	it("should login user", async () => {
		await auth.login(mockUser.id);
		expect(auth.isAuthenticated()).toBe(true);
		expect(auth.user).toEqual(mockUser);
	});

	it("should logout user", async () => {
		await auth.login(mockUser.id);
		await auth.logout();
		expect(auth.isAuthenticated()).toBe(false);
		expect(auth.user).toBeNull();
	});

	it("should restore user from session", async () => {
		await auth.login(mockUser.id);
		session.commit();

		// Create new auth instance with same session
		const newAuth = new Auth(session, async (id) => {
			if (id === mockUser.id)
				return mockUser;
			return null;
		});

		await newAuth.check();
		expect(newAuth.isAuthenticated()).toBe(true);
		expect(newAuth.user).toEqual(mockUser);
	});

	it("should throw error when getting non-existent user", async () => {
		await expect(auth.getAuthUser()).rejects.toThrow("User not found");
	});
});
