import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { AssetsManager } from "../src/assets/index.js";

describe("assetsManager", () => {
	let assetsManager: AssetsManager;
	const mockManifest = {
		entryPoints: {
			app: {
				js: ["/assets/app.js"],
				css: ["/assets/app.css"],
			},
		},
	};

	const manifestPath = join(process.cwd(), "dist", "manifest.json");

	beforeAll(() => {
		// Create the dist directory and manifest file
		mkdirSync(join(process.cwd(), "dist"), { recursive: true });
		writeFileSync(manifestPath, JSON.stringify(mockManifest));
	});

	beforeEach(() => {
		assetsManager = new AssetsManager({
			manifestPath,
			inProduction: true,
		});
	});

	it("should get JS script tags", () => {
		const script = assetsManager.getJsScript("app");
		expect(script).toContain("<script type=\"module\" src=\"/assets/app.js\" ></script>");
	});

	it("should get CSS style tags", () => {
		const style = assetsManager.getCssStyle("app");
		expect(style).toContain("<link rel=\"stylesheet\" href=\"/assets/app.css\" >");
	});

	it("should throw error for non-existent asset", () => {
		expect(() => assetsManager.getJsScript("non-existent")).toThrow("Asset not found");
	});

	it("should handle custom attributes", () => {
		const script = assetsManager.getJsScript("app", "defer crossorigin=\"anonymous\"");
		expect(script).toContain("defer crossorigin=\"anonymous\"");
	});
});
