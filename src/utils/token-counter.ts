export function logTokenUsage(usage: unknown): void {
	console.log("Usage:", usage);
}

export function createStreamingTokenCounter(
	response: Response,
	headers: Headers,
): Response {
	const { readable, writable } = new TransformStream();
	const reader = response.body?.getReader();
	const writer = writable.getWriter();
	const decoder = new TextDecoder();

	(async () => {
		try {
			while (reader) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value, { stream: true });

				// Check if chunk contains usage information
				if (chunk.includes('"usage":{')) {
					try {
						// Extract the data line from SSE format
						const lines = chunk.split("\n");
						for (const line of lines) {
							if (line.startsWith("data: ") && line !== "data: [DONE]") {
								const jsonStr = line.substring(6);
								const data = JSON.parse(jsonStr);
								if (data.usage) {
									logTokenUsage(data.usage);
									break;
								}
							}
						}
					} catch (_e) {
						// Ignore parsing errors
					}
				}

				await writer.write(value);
			}
		} finally {
			await writer.close();
		}
	})();

	return new Response(readable, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}

export async function logNonStreamingTokens(response: Response): Promise<void> {
	const clonedResponse = response.clone();
	try {
		const data = await clonedResponse.json();
		if (data.usage) {
			logTokenUsage(data.usage);
		}
	} catch (_e) {
		// Ignore parsing errors
	}
}
