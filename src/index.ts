import debug from "./debug.js";

export default {

	greet(name: string) {
		debug("Greeting %s", name);
		return `Hello, ${name}!`;
	},
};
