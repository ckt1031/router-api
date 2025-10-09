#!/usr/bin/env bun

import { apiConfigSchema } from "../src/schema";
import apiConfig from "../data/api.json" with { type: "json" };
import type { APIConfig } from "../src/schema";

/**
 * Validate the API configuration against the schema
 */
function validateConfig(): void {
	try {
		const config = apiConfig as APIConfig;
		apiConfigSchema.parse(config);
		console.log("API configuration is valid");
	} catch (error) {
		console.error("API configuration validation failed:", error);
		process.exit(1);
	}
}

validateConfig();