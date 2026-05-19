import type { ISessionStore, SessionConfig, SessionData } from "./types.js";
import debug from "../debug.js";
import { Encryption } from "../helpers/index.js";

export class CookieStore implements ISessionStore {
	private config: SessionConfig;
	private encryption: Encryption;
	private expiresInMs: number;

	constructor(config: SessionConfig) {
		this.config = config;
		// encryption takex in ms
		this.expiresInMs = Number(this.config.ageInSeconds!) * 1000;
		this.encryption = new Encryption({ secret: config.secret! });
	}

	read(): SessionData | null {
		const encValue = this.config.cookie!.getCookie();
		const cookieValue = this.encryption.decrypt(encValue);
		if (encValue && typeof cookieValue !== "object") {
			debug("Failed to decrypt session cookie or value is not an object");
		}

		if (!cookieValue || typeof cookieValue !== "object" || Array.isArray(cookieValue)) {
			return null;
		}

		return cookieValue as SessionData;
	}

	write(value: SessionData): void {
		const encValue = this.encryption.encrypt(value, this.expiresInMs);
		this.config.cookie!.setCookie(encValue);
	}

	destroy(): void {
		if (this.config.cookie?.deleteCookie) {
			this.config.cookie.deleteCookie();
		}
		else {
			this.config.cookie!.setCookie("");
		}
	}

	touch(): void {
		const value = this.read();
		if (!value) {
			return;
		}

		this.write(value);
	}
}
