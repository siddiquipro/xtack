import { randomBytes } from "node:crypto";

function words(value: string): string[] {
	return value
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.replace(/[_\-.]+/g, " ")
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.map(word => word.toLowerCase());
}

function upperFirst(value: string): string {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

const string = {
	noCase(value: string): string {
		return words(value).join(" ");
	},
	camelCase(value: string): string {
		const [first = "", ...rest] = words(value);
		return first + rest.map(upperFirst).join("");
	},
	pascalCase(value: string): string {
		return words(value).map(upperFirst).join("");
	},
	snakeCase(value: string): string {
		return words(value).join("_");
	},
	dashCase(value: string): string {
		return words(value).join("-");
	},
	dotCase(value: string): string {
		return words(value).join(".");
	},
	titleCase(value: string): string {
		return words(value).map(upperFirst).join(" ");
	},
	capitalCase(value: string): string {
		return this.titleCase(value);
	},
	sentenceCase(value: string): string {
		const [first = "", ...rest] = words(value);
		return [upperFirst(first), ...rest].join(" ").trim();
	},
	slug(value: string): string {
		return this.dashCase(value);
	},
	pluralize(value: string): string {
		const lowered = value.toLowerCase();
		if (
			lowered.endsWith("s")
			|| lowered.endsWith("x")
			|| lowered.endsWith("z")
			|| lowered.endsWith("ch")
			|| lowered.endsWith("sh")
		) {
			return `${value}es`;
		}
		if (/[^aeiou]y$/.test(lowered)) {
			return `${value.slice(0, -1)}ies`;
		}
		return `${value}s`;
	},
	plural(value: string): string {
		return this.pluralize(value);
	},
	singular(value: string): string {
		const lowered = value.toLowerCase();
		if (lowered.endsWith("ies"))
			return `${value.slice(0, -3)}y`;
		if (/(?:ses|xes|zes|ches|shes)$/.test(lowered))
			return value.slice(0, -2);
		if (lowered.endsWith("s"))
			return value.slice(0, -1);
		return value;
	},
	truncate(value: string, maxLength: number): string {
		if (value.length <= maxLength)
			return value;
		return `${value.slice(0, maxLength)}...`;
	},
	excerpt(value: string, maxLength: number): string {
		return this.truncate(value, maxLength);
	},
	random(length = 16): string {
		const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		const bytes = randomBytes(length);
		let output = "";
		for (let i = 0; i < length; i++) {
			output += chars[bytes[i] % chars.length];
		}
		return output;
	},
	ordinal(value: number): string {
		const mod100 = value % 100;
		if (mod100 >= 11 && mod100 <= 13)
			return `${value}th`;
		switch (value % 10) {
			case 1: return `${value}st`;
			case 2: return `${value}nd`;
			case 3: return `${value}rd`;
			default: return `${value}th`;
		}
	},
};

export default string;
