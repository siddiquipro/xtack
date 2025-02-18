import { readFileSync } from "node:fs";

interface AssetConfig {
	manifestPath: string;
	inProduction: boolean;
}

export class AssetsManager {
	manifestCache: Record<string, any> | null = null;
	config: AssetConfig;

	constructor(config: AssetConfig) {
		this.config = config;

		if (this.config.inProduction)
			this.getViteManifest();
	}

	public getJsScript(name: string) {
		const paths = this.getAssetPath(name, "js");
		return paths.map(path => `<script type="module" src="${path}"></script>`).join("");
	}

	public getCssStyle(name: string) {
		const paths = this.getAssetPath(name, "css");
		return paths.map(path => `<link rel="stylesheet" href="${path}">`).join("");
	}

	private getAssetPath(name: string, type: string) {
		const manifest = this.getViteManifest();
		const entry = manifest.entryPoints[name];
		if (!entry)
			throw new Error("Asset not found");

		if (type === "css")
			return (entry.css as string[]) ?? [];
		if (type === "js")
			return (entry.js as string[]) ?? [];
		return [];
	}

	private getViteManifest() {
		if (this.manifestCache)
			return this.manifestCache;
		const rawManifest = readFileSync(this.config.manifestPath, "utf-8");
		const manifest = JSON.parse(rawManifest);

		if (this.config.inProduction)
			this.manifestCache = manifest;
		return manifest;
	}
}
