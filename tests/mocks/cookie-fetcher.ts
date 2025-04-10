import type { CookieFetcher } from "../../src/session/types.js";

export class MockCookieFetcher implements CookieFetcher {
	private cookie: string | undefined;

	getCookie(): string | undefined {
		return this.cookie;
	}

	setCookie(value: string): void {
		this.cookie = value;
	}

	deleteCookie(): string | undefined {
		const oldCookie = this.cookie;
		this.cookie = undefined;
		return oldCookie;
	}
}
