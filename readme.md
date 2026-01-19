# Xtack

A collection of Node.js framework agnostic packages for building web applications.

## Installation

```bash
npm install xtack
# or
pnpm add xtack
```

## Exports

- [AssetsManager](#assetsmanager) - Vite manifest asset management
- [Auth](#auth) - Session-based authentication
- [Exception](#exception) - HTTP exception handling
- [NodeHbs](#nodehbs) - Handlebars template engine
- [Session](#session) - Session management with flash messages
- [CsrfShield](#csrfshield) - CSRF protection
- [Encryption & helpers](#encryption-and-helpers) - Encryption and utility helpers

---

### `AssetsManager`

The `AssetsManager` class manages and retrieves asset paths from a Vite manifest file.

```ts
import { AssetsManager } from "xtack";

const assetsManager = new AssetsManager({
	manifestPath: "path/to/manifest.json",
	inProduction: true, // caches manifest in production
});

// Generate script tags with optional attributes
const jsScript = assetsManager.getJsScript("main", "defer");
// <script type="module" src="/assets/main.js" defer></script>

// Generate stylesheet link tags with optional attributes
const cssStyle = assetsManager.getCssStyle("main", "media='screen'");
// <link rel="stylesheet" href="/assets/main.css" media='screen'>
```

---

### `Auth`

The `Auth` class provides session-based user authentication with a generic type for your user model.

```ts
import { Auth, Session } from "xtack";

interface User {
	id: number;
	name: string;
	email: string;
}

const session = new Session(sessionConfig);
const auth = new Auth<User>(session, async (id) => {
	// Fetch user from database
	return await db.users.find(id);
});

// Login user by ID
await auth.login(userId);

// Check if user session exists and restore user
await auth.check();

// Get authenticated user (throws if not authenticated)
const user = await auth.getAuthUser();

// Check authentication status
const isLoggedIn = auth.isAuthenticated();

// Access user directly
const currentUser = auth.user;

// Logout user
await auth.logout();
```

---

### `Exception`

The `Exception` class extends the native Error class with HTTP status code support.

```ts
import { Exception } from "xtack";

// Throw with custom status code (default is 500)
throw new Exception("Resource not found", 404);

// In error handler
catch (error) {
	if (error instanceof Exception) {
		console.error(error.message); // "Resource not found"
		console.error(error.status);  // 404
	}
}
```

---

### `NodeHbs`

The `NodeHbs` class provides a Handlebars template engine with support for layouts, partials, helpers, and caching.

```ts
import { NodeHbs } from "xtack";

const hbs = new NodeHbs({
	viewsPath: "path/to/views", // Required: path to view templates
	partialsPath: "path/to/partials", // Optional: defaults to viewsPath/partials
	layoutsPath: "path/to/layouts", // Optional: defaults to viewsPath/layouts
	externalPartialPaths: ["other/partials"], // Optional: additional partial paths
	cacheViews: true, // Optional: cache compiled templates (default: true)
	defaultLayout: "main", // Optional: default layout name (default: "main")
	globalData: { siteName: "My Site" }, // Optional: data available in all templates
});

// Register custom helpers
hbs.registerHelper("uppercase", str => str.toUpperCase());
hbs.registerHelper("formatDate", date => new Date(date).toLocaleDateString());

// Register additional partials
hbs.registerPartial("path/to/more/partials");

// Render template with data and layout
const html = hbs.render("template", { title: "Hello" }, "main");

// Render without layout
const htmlNoLayout = hbs.render("template", { title: "Hello" }, null);

// Get list of registered partials
const partials = hbs.getRegisteredPartialNames();
```

**Template Structure Example:**

```
views/
├── home.hbs
├── about.hbs
├── layouts/
│   └── main.hbs        # Use {{mainSlot}} for content
└── partials/
    ├── header.hbs
    └── footer.hbs
```

**Layout Example (main.hbs):**

```handlebars
<!DOCTYPE html>
<html>
<head><title>{{siteName}}</title></head>
<body>
  {{> header}}
  {{{mainSlot}}}
  {{> footer}}
</body>
</html>
```

---

### `Session`

The `Session` class provides session management with encrypted cookie storage and flash messages.

```ts
import { Session } from "xtack";

const session = new Session({
	secret: "your-32-character-secret-key-here", // Required: encryption key
	ageInSeconds: 3600, // Required: session lifetime
	cookie: {
		getCookie: () => request.cookies.session,
		setCookie: value => response.cookie("session", value),
		deleteCookie: () => response.clearCookie("session"), // Optional
	},
	sessionIdKey: "__id__", // Optional: custom session ID key
	flashKey: "__flash__", // Optional: custom flash messages key
});

// Initialize session (call at start of request)
session.initiate();

// Get session ID
const sessionId = session.id;

// Store values
session.put("userId", 123);
session.put("preferences", { theme: "dark" });

// Retrieve values
const userId = session.get("userId");
const theme = session.get("preferences.theme", "light"); // with default

// Check if key exists
if (session.has("userId")) { /* ... */ }

// Remove a key
session.forget("userId");

// Get and remove in one operation
const value = session.pull("tempData", null);

// Increment/decrement numeric values
session.increment("views");
session.decrement("credits", 5);

// Flash messages (available only on next request)
session.flash("success", "Operation completed!");
session.flash("errors", ["Invalid email", "Password required"]);

// Retrieve flash messages (only available after initiate on next request)
const successMsg = session.getFlash("success");

// Get all session data
const allData = session.all();

// Clear all session data
session.clear();

// Commit session (call at end of request)
session.commit();
```

---

### `CsrfShield`

The `CsrfShield` class provides CSRF (Cross-Site Request Forgery) protection for your application.

```ts
import { CsrfShield, Session } from "xtack";

const session = new Session(sessionConfig);
session.initiate();

const csrf = new CsrfShield({
	session,
	csrfMethods: ["POST", "PUT", "PATCH", "DELETE"], // Optional: methods to validate (defaults shown)
	getRequestMethod: async () => request.method,
	getCsrfTokenFromBody: async () => request.body._csrf || request.headers["x-csrf-token"],
	setCsrfToken: async (token) => {
		// Make token available to templates
		response.locals.csrfToken = token;
	},
});

// Validate and generate CSRF token
const isValid = await csrf.handle();

if (!isValid) {
	throw new Exception("Invalid CSRF token", 403);
}

// Use in forms
// <input type="hidden" name="_csrf" value="{{csrfToken}}">
```

---

### `Encryption` and `helpers`

Re-exports from `@adonisjs/encryption` and `@poppinss/utils` for encryption and common utility functions.

```ts
import { Encryption, helpers } from "xtack";

// Encryption (from @adonisjs/encryption)
const encryption = new Encryption({
	secret: "your-32-character-secret-key-here",
});

const encrypted = encryption.encrypt("Sensitive data");
const decrypted = encryption.decrypt(encrypted);

// String helpers (from @poppinss/utils/string)
helpers.string.slug("Hello World"); // "hello-world"
helpers.string.camelCase("hello_world"); // "helloWorld"
helpers.string.snakeCase("helloWorld"); // "hello_world"
helpers.string.dashCase("helloWorld"); // "hello-world"
helpers.string.pascalCase("hello_world"); // "HelloWorld"
helpers.string.capitalCase("hello_world"); // "Hello World"
helpers.string.sentenceCase("helloWorld"); // "Hello world"
helpers.string.dotCase("helloWorld"); // "hello.world"
helpers.string.noCase("helloWorld"); // "hello world"
helpers.string.titleCase("hello world"); // "Hello World"
helpers.string.pluralize("box"); // "boxes"
helpers.string.truncate("Long text...", 10); // "Long te..."
helpers.string.excerpt("Long text...", 10); // "Long..."
helpers.string.random(16); // random string
helpers.string.ordinal(1); // "1st"

// Assert helper (from @poppinss/utils/assert)
helpers.assert(condition, "Error message");

// Other utilities from @poppinss/utils
helpers.base64.encode("hello");
helpers.base64.decode("aGVsbG8=");
```

## License

MIT
