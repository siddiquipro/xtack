import type { CookieOptions } from "hono/utils/cookie";
import { join } from "node:path";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { NodeHbs, Session } from "../../src/index.js";

interface Variables {
	session: Session;
}

const app = new Hono<{ Variables: Variables }>();

const root = join(import.meta.dirname, "..");

const hbs = new NodeHbs({
	viewsPath: join(root, "views"),
	layoutsPath: join(root, "views", "layout"),
});

const config = {
	key: "my-strong-32-character-secret-key",
	cookieName: "xtack-session",
	cookie: {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		maxAge: 1 * 60 * 60, // 1 hour
	} satisfies CookieOptions,
};

app.use(async (c, next) => {
	const session = new Session({
		secret: config.key,
		ageInSeconds: config.cookie.maxAge,
		cookie: {
			getCookie: () => getCookie(c, config.cookieName),
			setCookie: value => setCookie(c, config.cookieName, value, config.cookie),
			deleteCookie: () => deleteCookie(c, config.cookieName),
		},
	});

	session.initiate();

	c.set("session", session);

	await next();
	session.commit();
});

app.get("/", (c) => {
	const session = c.get("session") as Session;
	const message = session.getFlash("message") || "No Message";
	return c.html(hbs.render("home", { message }));
});

app.post("/", async (c) => {
	const session = c.get("session") as Session;
	const fd = await c.req.formData();
	const message = fd.get("message") || "None";
	session.flash("message", message);
	console.warn("Message Set:", message);
	return c.redirect("/");
});

serve({
	fetch: app.fetch,
	port: 3000,
}, (info) => {
	console.warn(`Server is running on http://localhost:${info.port}`);
});
