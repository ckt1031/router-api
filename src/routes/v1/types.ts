import type { APIConfig } from "../../schema.ts";

export type V1Env = {
	Variables: {
		userKey: APIConfig["userKeys"][number];
	};
};
