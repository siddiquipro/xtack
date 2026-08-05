import { Encryption } from "./encryption.js";
import string from "./string.js";

export { Encryption };

export const helpers = { string };

// Backward compatibility layer for deprecated utilities
// These provide clear error messages to guide migration
function createDeprecatedFunction(name: string): () => never {
	return () => {
		throw new Error(
			`[xtack] helpers.${name}() has been removed. The @poppinss/utils dependency has been replaced with Node.js built-in modules for a lighter footprint. Please migrate to: lodash.${name}, just-${name.toLowerCase()}, or native implementations.`,
		);
	};
}

// Export deprecation helpers with clear errors
export const isEmpty = createDeprecatedFunction("isEmpty");
export const isObject = createDeprecatedFunction("isObject");
export const isArray = createDeprecatedFunction("isArray");
export const isFunction = createDeprecatedFunction("isFunction");
export const isNumber = createDeprecatedFunction("isNumber");
export const isBoolean = createDeprecatedFunction("isBoolean");
export const isString = createDeprecatedFunction("isString");
export const isNull = createDeprecatedFunction("isNull");
export const isUndefined = createDeprecatedFunction("isUndefined");
export const isNil = createDeprecatedFunction("isNil");
export const isDate = createDeprecatedFunction("isDate");
export const isRegExp = createDeprecatedFunction("isRegExp");
export const isError = createDeprecatedFunction("isError");
export const hasOwn = createDeprecatedFunction("hasOwn");
export const pick = createDeprecatedFunction("pick");
export const omit = createDeprecatedFunction("omit");
export const snakeCase = createDeprecatedFunction("snakeCase");
export const camelCase = createDeprecatedFunction("camelCase");
export const pascalCase = createDeprecatedFunction("pascalCase");
export const dasherize = createDeprecatedFunction("dasherize");
export const pluralize = createDeprecatedFunction("pluralize");
export const messageBuilder = createDeprecatedFunction("messageBuilder");
export const defineStaticProperty = createDeprecatedFunction("defineStaticProperty");
export const fsImportAll = createDeprecatedFunction("fsImportAll");
export const esmRequire = createDeprecatedFunction("esmRequire");
export const slash = createDeprecatedFunction("slash");
export const getEsmRequire = createDeprecatedFunction("getEsmRequire");

export function assert(): never {
	throw new Error(
		"[xtack] helpers.assert has been removed. The @poppinss/utils/assert dependency has been replaced. Please use: https://www.npmjs.com/package/assert or Zod/Joi for runtime validation.",
	);
}
