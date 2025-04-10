import type { Session } from "../session/index.js";

import Tokens from "csrf";

interface CsrfShieldConfig {
	session: Session;
	csrfMethods?: string[];
	getRequestMethod: () => Promise<string>;
	getCsrfTokenFromBody: () => Promise<string>;
	setCsrfToken: (token: string) => Promise<void>;
}

export class CsrfShield {
	private secretSessionKey = "__csrf_secret";
	private csrfMethods: string[];

	protected _tokens = new Tokens();
	protected config: CsrfShieldConfig;

	constructor(config: CsrfShieldConfig) {
		this.csrfMethods = config.csrfMethods || ["POST", "PUT", "PATCH", "DELETE"];
		this.config = config;
	}

	private async shouldValidateRequest() {
		const method = await this.config.getRequestMethod();
		return this.csrfMethods.includes(method.toUpperCase());
	}

	private async getCsrfTokenFromRequest() {
		const body = await this.config.getCsrfTokenFromBody();
		return body;
	}

	private generateCsrfToken(csrfSecret: string) {
		return this._tokens.create(csrfSecret);
	}

	private async getCsrfSecret() {
		const csrfSecret = this.config.session.get(this.secretSessionKey);
		if (csrfSecret)
			return csrfSecret;

		const newCsrfSecret = await this._tokens.secret();
		this.config.session.put(this.secretSessionKey, newCsrfSecret);
		return newCsrfSecret;
	}

	public async handle() {
		const csrfSecret = await this.getCsrfSecret();

		const shouldValidate = await this.shouldValidateRequest();
		if (shouldValidate) {
			const csrfToken = await this.getCsrfTokenFromRequest();
			if (!csrfToken || !this._tokens.verify(csrfSecret, csrfToken)) {
				return false;
			}
		}

		const csrfToken = this.generateCsrfToken(csrfSecret);

		await this.config.setCsrfToken(csrfToken);

		return true;
	}
}
