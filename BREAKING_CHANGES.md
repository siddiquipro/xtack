# Breaking Changes

## Scope

Comparison range:
- Previous commit: `f287092` (v1.2.6 release commit)
- New commit: `bdec3bc` (`Restructure library by removing dependencies: BREAKING CHANGE`)

## Summary

This change removes third-party utility and crypto dependencies from the public behavior surface and introduces stricter runtime/tooling requirements.

## Breaking Changes

### 1) Node runtime requirement is now Node 24.x

- File: `package.json`
- Change: `engines.node` is now `24.x`.
- Impact: installs and CI on older Node versions will fail or be unsupported.

Migration:
- Update local/dev/CI runtimes to Node 24.x.
- Align version managers (`.nvmrc`, Volta, CI setup) to Node 24.

### 2) Public package entry behavior is now constrained by explicit exports map

- File: `package.json`
- Change: explicit `exports` map added for:
  - `.`
  - `./session`
  - `./auth`
  - `./shield`
  - `./hbs`
  - `./assets`
  - `./helpers`
- Impact: any deep imports not listed in `exports` may stop working.

Migration:
- Use only supported entry points above.
- Replace deep/internal imports with documented public imports.

### 3) helpers API no longer re-exports `@poppinss/utils`

- Files: `src/helpers/index.ts`, `readme.md`, `package.json`
- Change:
  - `@poppinss/utils` removed.
  - `helpers` now only provides `helpers.string`.
  - previously available helper utilities (`helpers.assert`, `helpers.base64`, type checks, object helpers, etc.) are no longer available as before.
- Impact:
  - Existing calls to removed helper utilities will break.
  - Several removed utility names now have migration-guard exports that throw explicit runtime errors when called.

Migration:
- Replace `helpers.assert(...)` with Node `assert` or your validation library (for example Zod/Joi).
- Replace utility calls with native Node.js or dedicated libraries (for example Lodash).
- Keep using `helpers.string` where applicable.

### 4) Encryption implementation changed

- Files: `src/helpers/encryption.ts`, `src/helpers/index.ts`, `package.json`, `readme.md`
- Change:
  - `@adonisjs/encryption` removed.
  - Encryption now uses native AES-256-GCM implementation provided by this package.
- Impact:
  - Ciphertext format and compatibility expectations may differ from old behavior.
  - Data encrypted with old implementation may not be decryptable by the new implementation.

Migration:
- Plan key/cipher migration for persisted encrypted payloads (cookies/session blobs/tokens).
- If backward decryption is needed, provide compatibility decode logic during rollout.

### 5) CSRF token engine changed

- Files: `src/shield/index.ts`, `src/shield/csrf-tokens.ts`, `package.json`
- Change:
  - `csrf` package removed.
  - internal CSRF token generation/verification now uses `CsrfTokens`.
- Impact:
  - Token format/verification semantics may differ from previous implementation.
  - Existing issued tokens may fail validation after deployment.

Migration:
- Expect token invalidation during deployment (users may need to refresh forms/session).
- Roll out during a maintenance window if strict CSRF continuity is required.

### 6) Auth unauthorized error contract changed

- File: `src/auth/index.ts`
- Change:
  - `Auth.getAuthUser()` now throws `Exception("Unauthorized", 401)` when user is absent.
  - previously it threw a generic `Error("User not found")`.
- Impact:
  - Error handling code checking old message/type will break.

Migration:
- Update handlers to catch `Exception` with status `401`.
- Do not depend on the old error message.

## Non-breaking Additions (for awareness)

- Session now supports custom store via `SessionConfig.store` (`ISessionStore`).
- `Session.regenerateId()` added.
- `Auth.mustBeAuthenticated()` added.
- `NodeHbs.clearCache()` added.

## Migration Checklist

- [ ] Run project on Node 24.x everywhere (local + CI + prod).
- [ ] Remove all deep/internal imports and use exported entry points only.
- [ ] Replace removed `helpers.*` utilities with native or external alternatives.
- [ ] Validate encryption compatibility and migrate old encrypted data if needed.
- [ ] Validate CSRF behavior and account for token invalidation.
- [ ] Update auth error handling to expect `Exception` 401.
