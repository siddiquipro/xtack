import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return {
		cacheDir: `node_modules/.vite`,
		build: {
			lib: {
				entry: resolve(__dirname, "src/index.ts"),
				formats: ["es"],
				fileName: "index",
			},
			rollupOptions: {
				external: ["node:fs", "node:fs/promises", "node:util", "node:path", "node:url", "node:buffer", "node:crypto", "node:assert", "@poppinss/utils", "@poppinss/utils/string", "@poppinss/utils/lodash", "@adonisjs/encryption", "@poppinss/utils/assert", "assert", "handlebars"],
			},
		},

		test: {
			include: ["tests/*.spec.ts", "tests/*.test.ts"],
		},
		plugins: [
			// generate typescript types
			dts({ insertTypesEntry: true }),
		],
		define: {
			"import.meta.vitest": mode !== "production",
		},
	};
});
