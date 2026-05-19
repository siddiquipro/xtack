import type { AllowedSessionValues, SessionData } from "./types.js";
import { Exception } from "../exception/index.js";
import { deepMerge } from "../helpers/merge.js";

export class ValuesStore {
	protected values: Map<string, AllowedSessionValues>;
	private modified = false;

	constructor(values: SessionData | null) {
		this.values = new Map(Object.entries(values || {}));
	}

	get isEmpty() {
		return this.values.size === 0;
	}

	get hasBeenModified() {
		return this.modified;
	}

	has(key: string) {
		return this.values.has(key);
	}

	get<T = AllowedSessionValues>(key: string, defaultValue?: T): T | undefined {
		if (!this.values.has(key)) {
			return defaultValue;
		}
		return this.values.get(key) as T;
	}

	set(key: string, value: AllowedSessionValues) {
		this.values.set(key, value);
		this.modified = true;
	}

	unset(key: string) {
		this.values.delete(key);
		this.modified = true;
	}

	pull(key: string, defaultValue: any) {
		const value = this.get(key, defaultValue);
		this.unset(key);
		return value;
	}

	increment(key: string, steps = 1) {
		const value = this.get(key, 0);
		if (typeof value !== "number") {
			throw new Exception(`Cannot increment "${key}". Existing value is not a number`);
		}

		this.set(key, value + steps);
	}

	decrement(key: string, steps = 1) {
		const value = this.get(key, 0);
		if (typeof value !== "number") {
			throw new Exception(`Cannot decrement "${key}". Existing value is not a number`);
		}

		this.set(key, value - steps);
	}

	// get all values as an object
	all() {
		return Object.fromEntries(this.values);
	}

	toString() {
		return JSON.stringify(this.all());
	}

	update(values: SessionData): void {
		this.modified = true;
		this.values = new Map(Object.entries(values || {}));
	}

	merge(values: SessionData): void {
		this.modified = true;
		const currentValues = this.all();
		const mergedValues = deepMerge(currentValues, values) as SessionData;
		this.values = new Map(Object.entries(mergedValues));
	}

	clear(): void {
		this.update({});
	}
}
