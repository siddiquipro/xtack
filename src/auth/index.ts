import type { Session } from "../session/index.js";

export class Auth<T> {
	private session: Session;
	private authKey = "__auth__";

	private fetchUser: (id: number | string) => Promise<T | null>;

	public user: T | null = null;

	constructor(session: Session, fetchUser: (id: number | string) => Promise<T | null>) {
		this.session = session;
		this.fetchUser = fetchUser;
	}

	// Login method
	public async login(id: number | string): Promise<void> {
		this.user = await this.fetchUser(id);
		this.session.put(this.authKey, id);
	}

	async getAuthUser() {
		await this.check();
		if (!this.user) {
			throw new Error("User not found");
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

		const id = this.session.get(this.authKey);
		if (id) {
			this.user = await this.fetchUser(id);
		}
	}
}
