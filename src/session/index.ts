import type { AllowedSessionValues, SessionConfig, SessionData } from "./types.js";
import { randomUUID } from "node:crypto";
import debug from "../debug.js";
import { Exception } from "../exception/index.js";
import { CookieStore } from "./cookie-store.js";
import { ValuesStore } from "./value-store.js";

export class Session {
	private store: CookieStore;
	private _valuesStore?: ValuesStore;
	private sessionIdKey = "__id__";
	private _flash = {
		key: "__flash__",
		messages: new ValuesStore({}),
		readonlyMessages: new ValuesStore({}), // these are only read only
	};

	constructor(config: SessionConfig) {
		if (!config.secret)
			throw new Error("Session secret is required");
		if (Number.isNaN(config.ageInSeconds))
			throw new Error("Session age is required");

		if (config.flashKey) {
			this._flash.key = config.flashKey;
		}

		if (config.sessionIdKey) {
			this.sessionIdKey = config.sessionIdKey;
		}

		this.store = new CookieStore(config);
	}

	initiate() {
		const contents = this.store.read() as SessionData | null;
		this._valuesStore = new ValuesStore(contents);
		if (this.has(this._flash.key)) {
			const currentValues = this.pull(this._flash.key, null);
			this._flash.readonlyMessages.update(currentValues);
			debug("Session has flash messages", currentValues);

			// remove the flash messages from the session
			this.forget(this._flash.key);
		}

		this.initializeSessionId();
	}

	commit() {
		if (!this._flash.messages.isEmpty) {
			this.put(this._flash.key, this._flash.messages.all());
		}
		this.store.write(this.all());
	}

	private initializeSessionId() {
		if (this.id) {
			return;
		}
		this.put(this.sessionIdKey, randomUUID().replace(/-/g, ""));
	}

	get valuesStore() {
		if (!this._valuesStore) {
			throw new Exception("Session not initiated", 500);
		}
		return this._valuesStore;
	}

	get id() {
		if (!this._valuesStore) {
			return null;
		}
		return this.get(this.sessionIdKey);
	}

	get(key: string, defaultValue?: any) {
		return this.valuesStore.get(key, defaultValue);
	}

	put(key: string, value: AllowedSessionValues) {
		this.valuesStore.set(key, value);
	}

	has(key: string): boolean {
		return this.valuesStore.has(key);
	}

	forget(key: string) {
		this.valuesStore.unset(key);
	}

	pull(key: string, defaultValue: any) {
		return this.valuesStore.pull(key, defaultValue);
	}

	increment(key: string, steps = 1) {
		return this.valuesStore.increment(key, steps);
	}

	decrement(key: string, steps = 1) {
		return this.valuesStore.decrement(key, steps);
	}

	getFlash(key: string) {
		return this._flash.readonlyMessages.get(key, undefined);
	}

	flash(key: string, value: AllowedSessionValues) {
		this._flash.messages.set(key, value);
	}

	clear() {
		this.valuesStore.clear();
	}

	all() {
		return this.valuesStore.all();
	}
}
