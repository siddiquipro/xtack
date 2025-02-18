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

const jsScript = assetsManager.getJsScript("main");
const cssStyle = assetsManager.getCssStyle("main");
```

### `Auth`

The `Auth` class is used to authenticate users.

```ts
import { Auth, Session } from "xtack";

const session = new Session(sessionConfig);
const auth = new Auth(session, fetchUserFunction);

await auth.login(userId);
const user = await auth.getAuthUser();
await auth.logout();
```

### `Exception`

The `Exception` class is used to handle exceptions.

```ts
import { Exception } from "xtack";

try {
	throw new Exception("Something went wrong");
}
catch (error) {
	console.error(error.message);
}
```

### `NodeHbs`

The `NodeHbs` class is used to render Handlebars templates.

```ts
import { NodeHbs } from "xtack";

const hbs = new NodeHbs({
	partialsDir: "path/to/partials",
	helpers: {
		uppercase: str => str.toUpperCase(),
	},
});

const html = hbs.render("template.hbs", { title: "Hello, world!" });
```

### `Encryption`

The `Encryption` class is used to encrypt and decrypt data.

```ts
import { Encryption } from "xtack";

const encryption = new Encryption({
	secretKey: "your-secret-key",
});

const encrypted = encryption.encrypt("Sensitive data");
const decrypted = encryption.decrypt(encrypted);
```

### `helpers`

The `helpers` module provides utility functions.

```ts
import { helpers } from "xtack";

const formattedDate = helpers.formatDate(new Date());
```

### `Session`

The `Session` class is used to manage user sessions.

```ts
import { Session } from "xtack";

const session = new Session({
	secret: "your-session-secret",
	resave: false,
	saveUninitialized: true,
	cookie: { secure: true },
});

session.start();
session.set("userId", 123);
const userId = session.get("userId");
session.destroy();
```
