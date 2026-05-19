import { Buffer } from "node:buffer";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export class Encryption {
	private key: Buffer;

	constructor(config: { secret: string }) {
		this.key = createHash("sha256").update(config.secret).digest();
	}

	public encrypt(value: any, expiresInMs?: number): string {
		const payload = JSON.stringify(value);
		const iv = randomBytes(12);
		const cipher = createCipheriv("aes-256-gcm", this.key, iv);
		const encrypted = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
		const authTag = cipher.getAuthTag();
		const expiry = typeof expiresInMs === "number" ? Date.now() + expiresInMs : 0;

		return `${iv.toString("base64url")}.${encrypted.toString("base64url")}.${authTag.toString("base64url")}.${expiry}`;
	}

	public decrypt(value: string | undefined | null): any {
		if (!value) {
			return null;
		}

		try {
			const [ivRaw, encryptedRaw, authTagRaw, expiryRaw] = value.split(".");
			if (!ivRaw || !encryptedRaw || !authTagRaw || !expiryRaw) {
				return null;
			}

			const expiry = Number(expiryRaw);
			if (Number.isNaN(expiry)) {
				return null;
			}

			if (expiry !== 0 && Date.now() > expiry) {
				return null;
			}

			const iv = Buffer.from(ivRaw, "base64url");
			const encrypted = Buffer.from(encryptedRaw, "base64url");
			const authTag = Buffer.from(authTagRaw, "base64url");

			const decipher = createDecipheriv("aes-256-gcm", this.key, iv);
			decipher.setAuthTag(authTag);
			const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
			return JSON.parse(decrypted);
		}
		catch {
			return null;
		}
	}
}
