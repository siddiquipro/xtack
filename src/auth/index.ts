import type { Session } from "../session/index.js";
import { Exception } from "../exception/index.js";

export class Auth<T> {
	private session: Session;
	private authKey = "__auth__";
	private regenerateSessionOnLogin: boolean;

	private fetchUser: (id: number | string) => Promise<T | null>;

	public user: T | null = null;

	constructor(
		session: Session,
		fetchUser: (id: number | string) => Promise<T | null>,
		regenerateSessionOnLogin: boolean = false,
	) {
		this.session = session;
		this.fetchUser = fetchUser;
		// Default to false for backward compatibility; apps can opt-in to security enhancement
		this.regenerateSessionOnLogin = regenerateSessionOnLogin;
	}

	// Login method
	public async login(id: number | string): Promise<void> {
		this.user = await this.fetchUser(id);
		if (this.regenerateSessionOnLogin) {
			this.session.regenerateId();
		}
		this.session.put(this.authKey, id);
	}

	async getAuthUser(): Promise<T> {
		await this.check();
		if (!this.user) {
			throw new Exception("Unauthorized", 401);
		}
		return this.user;
	}

	public async mustBeAuthenticated(): Promise<T> {
		await this.check();
		if (!this.user) {
			throw new Exception("Unauthorized", 401);
		}
		return this.user;
	}

	// Logout method
	public async logout(): Promise<void> {
		this.user = null;
		this.session.forget(this.authKey);
	}

	// Check if a user is logged in
	public isAuthenticated(): boolean {
		return this.user !== null;
	}

	// Restore user session from stored session data
	public async check(): Promise<void> {
		if (this.user) {
			return;
		}

		const id = this.session.get<number | string>(this.authKey);
		if (id) {
			this.user = await this.fetchUser(id);
		}
	}
}
