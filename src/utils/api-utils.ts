export type BodyType = FormData | Record<string, string>;

export async function getValueFromBody(body: BodyType, key: string) {
	if (body instanceof FormData) return body.get(key) as string;
	return body[key];
}

export function modifyBodyWithStringValue(
	body: BodyType,
	name: string,
	value: string,
): BodyType {
	if (body instanceof FormData) {
		body.set(name, value);
		return body;
	}

	body[name] = value;

	return body;
}

export function removeFieldsFromBody(
	body: BodyType,
	fields: string[],
): BodyType {
	// Remove fields from FormData
	if (body instanceof FormData) {
		for (const field of fields) {
			body.delete(field);
		}
		return body;
	}

	for (const field of fields) {
		delete body[field];
	}

	return body;
}

export function bodyToBodyInit(body: BodyType): BodyInit {
	if (body instanceof FormData) return body;
	return JSON.stringify(body);
}
