export interface CookieFetcher {
	getCookie: () => string | undefined;
	setCookie: (value: string) => void;
	deleteCookie?: () => string | undefined;
}

export interface SessionConfig {
	secret?: string;
	ageInSeconds?: number;
	cookie?: CookieFetcher;
	sessionIdKey?: string;
	flashKey?: string;
	store?: ISessionStore;
}

export type AllowedSessionValues = string | boolean | number | object | Date | Array<any>;
export type SessionData = Record<string, AllowedSessionValues>;

export interface ISessionStore {
	read: () => SessionData | null;
	write: (value: SessionData) => void;
	destroy: () => void;
	touch: () => void;
}
