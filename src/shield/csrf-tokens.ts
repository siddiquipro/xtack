import { Buffer } from "node:buffer";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export class CsrfTokens {
	public async secret(): Promise<string> {
		return randomBytes(18).toString("base64url");
	}

	public create(secret: string): string {
		const salt = randomBytes(8).toString("base64url");
		const signature = createHmac("sha256", secret).update(salt).digest("base64url");
		return `${salt}.${signature}`;
	}

	public verify(secret: string, token: string): boolean {
		const parts = token.split(".");
		if (parts.length !== 2) {
			return false;
		}

		const [salt, signature] = parts;
		if (!salt || !signature) {
			return false;
		}

		const expected = createHmac("sha256", secret).update(salt).digest("base64url");
		const actualBuffer = Buffer.from(signature);
		const expectedBuffer = Buffer.from(expected);
		if (actualBuffer.length !== expectedBuffer.length) {
			return false;
		}

		return timingSafeEqual(actualBuffer, expectedBuffer);
	}
}
