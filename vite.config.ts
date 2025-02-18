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
				external: ["node:fs", "node:util", "node:path"],
			},
		},

		test: {
			include: ["tests/*.spec.ts"],
		},
		plugins: [
			// generate typescript types
			dts({ 	insertTypesEntry: true 	}),
		],
		define: {
			"import.meta.vitest": mode !== "production",
		},
	};
});
