function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneValue(value: unknown): unknown {
	if (Array.isArray(value)) {
		return [...value];
	}

	if (!isPlainObject(value)) {
		return value;
	}

	const output: Record<string, unknown> = {};
	for (const key of Object.keys(value)) {
		output[key] = cloneValue(value[key]);
	}
	return output;
}

export function deepMerge(target: unknown, source: unknown): unknown {
	if (!isPlainObject(target) || !isPlainObject(source)) {
		return cloneValue(source);
	}

	const output: Record<string, unknown> = { ...target };
	for (const key of Object.keys(source)) {
		const sourceValue = source[key];
		const targetValue = target[key];
		output[key] = isPlainObject(targetValue) && isPlainObject(sourceValue)
			? deepMerge(targetValue, sourceValue)
			: cloneValue(sourceValue);
	}
	return output;
}
