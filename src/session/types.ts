export interface CookieFetcher {
	getCookie: () => string | undefined;
	setCookie: (value: string) => void;
	deleteCookie?: () => string | undefined;
}

interface SessionBaseConfig {
	sessionIdKey?: string;
	flashKey?: string;
}

export type AllowedSessionValues = string | boolean | number | object | Date | Array<any>;
export type SessionData = Record<string, AllowedSessionValues>;

export interface ISessionStore {
	read: () => SessionData | null;
	write: (value: SessionData) => void;
	destroy: () => void;
	touch: () => void;
}

export interface CookieSessionConfig extends SessionBaseConfig {
	secret: string;
	ageInSeconds: number;
	cookie: CookieFetcher;
	store?: never;
}

export interface StoreSessionConfig extends SessionBaseConfig {
	store: ISessionStore;
	secret?: never;
	ageInSeconds?: never;
	cookie?: never;
}

export type SessionConfig = CookieSessionConfig | StoreSessionConfig;
