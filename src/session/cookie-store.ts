import { Encryption } from "../helpers/index.js";
import { SessionConfig } from "./types.js";

export class CookieStore {
  private config: SessionConfig;
  private encryption: Encryption;
  private expiresInMs: number;

  constructor(config: SessionConfig) {
    this.config = config;
    // encryption takex in ms
    this.expiresInMs = Number(this.config.ageInSeconds) * 1000;
    this.encryption = new Encryption({ secret: config.secret });
  }

  read() {
    const encValue = this.config.cookie.getCookie();
    const cookieValue = this.encryption.decrypt(encValue);
    return typeof cookieValue !== "object" ? null : cookieValue;
  }

  write(value: any) {
    const encValue = this.encryption.encrypt(value, this.expiresInMs);
    this.config.cookie.setCookie(encValue);
  }

  destroy() {
    this.config.cookie.deleteCookie();
  }

  touch(): void {
    const value = this.read();
    if (!value) {
      return;
    }

    this.write(value);
  }
}