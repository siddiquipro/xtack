import antfu from "@antfu/eslint-config";

export default antfu(
	{
		type: "lib",
		typescript: true,
		formatters: true,
		stylistic: {
			indent: "tab",
			semi: true,
			quotes: "double",
		},
		hbs: true,
		handlebars: true,
		markdown: false,
	},
	{
		rules: {
			"no-console": ["warn"],
			"antfu/no-top-level-await": ["off"],
			"node/prefer-global/process": ["off"],
			"node/no-process-env": ["error"],
			"perfectionist/sort-imports": ["error"],

			"unicorn/filename-case": [
				"error",
				{
					case: "kebabCase",
					ignore: ["README.md"],
				},
			],
		},
	},
);
