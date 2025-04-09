# Xtack

A collection of Node.js framework agnostic packages.

## Exports

### `AssetsManager`

The `AssetsManager` class is used to manage and retrieve asset paths from a Vite manifest.

```ts
import { AssetsManager } from "xtack";

const assetsManager = new AssetsManager({
	manifestPath: "path/to/manifest.json",
	inProduction: true,
});

const jsScript = assetsManager.getJsScript("main", "defer");
const cssStyle = assetsManager.getCssStyle("main", "media='screen'");
```

### `Auth`

The `Auth` class is used to authenticate users with session-based authentication.

```ts
import { Auth, Session } from "xtack";

const session = new Session(sessionConfig);
const auth = new Auth<UserType>(session, fetchUserFunction);

await auth.login(userId);
const user = await auth.getAuthUser();
const isAuthenticated = auth.isAuthenticated();
await auth.logout();
```

### `Exception`

The `Exception` class extends the native Error class with HTTP status code support.

```ts
import { Exception } from "xtack";

try {
	throw new Exception("Resource not found", 404);
}
catch (error) {
	console.error(error.message);
	console.error(error.status);
}
```

### `NodeHbs`

The `NodeHbs` class provides a robust Handlebars template engine with support for layouts, partials, and helpers.

```ts
import { NodeHbs } from "xtack";

const hbs = new NodeHbs({
	viewsPath: "path/to/views",
	partialsPath: "path/to/partials",
	layoutsPath: "path/to/layouts",
	cacheViews: true,
	globalData: { siteName: "My Site" }
});

hbs.registerHelper("uppercase", str => str.toUpperCase());

const html = hbs.render("template", { title: "Hello, world!" }, "main");
```

### `Encryption` and `helpers`

The `Encryption` class from @adonisjs/encryption and utility helpers from @poppinss/utils are exported.

```ts
import { Encryption, helpers } from "xtack";

const encryption = new Encryption({
	secretKey: "your-secret-key",
});

const encrypted = encryption.encrypt("Sensitive data");
const decrypted = encryption.decrypt(encrypted);

const formattedDate = helpers.formatDate(new Date());
const slug = helpers.string.slug("Hello World");
```

### `Session`

The `Session` class provides session management with cookie storage and flash messages.

```ts
import { Session } from "xtack";

const session = new Session({
	secret: "your-session-secret",
	ageInSeconds: 3600,
	cookie: {
		secure: true,
		httpOnly: true
	}
});

session.initiate();

session.put("userId", 123);
session.flash("success", "Operation completed");

const userId = session.get("userId");
const successMessage = session.getFlash("success");

session.commit();
```
