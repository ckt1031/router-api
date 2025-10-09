import { Hono } from "hono";
import { FC } from "hono/jsx";
import apiConfig from "../../../data/api.json" with { type: "json" };

const app = new Hono();

interface Provider {
    name: string;
    baseURL: string;
    keys: string[];
    enabled?: boolean;
    priority?: number;
    models?: (string | { request: string; destination: string })[];
}

const ProviderKeysList: FC<{ providers: Record<string, Provider> }> = ({ providers }) => {
    const providerEntries = Object.entries(providers);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                maxWidth: "800px",
                margin: "0 auto",
                padding: "20px",
                fontFamily: "sans-serif",
            }}
        >
            <h2>Provider Keys</h2>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                {providerEntries.map(([providerId, provider]) => (
                    <div
                        key={providerId}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "15px",
                            opacity: provider.enabled === false ? 0.5 : 1,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "10px",
                            }}
                        >
                            <h3
                                style={{
                                    margin: "0",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                }}
                            >
                                {provider.name}
                            </h3>
                            <span
                                style={{
                                    fontSize: "12px",
                                    color: "#666",
                                    fontFamily: "monospace",
                                }}
                            >
                                ({providerId})
                            </span>
                            {provider.enabled === false && (
                                <span
                                    style={{
                                        fontSize: "11px",
                                        color: "#999",
                                        padding: "2px 6px",
                                        border: "1px solid #ccc",
                                        borderRadius: "3px",
                                    }}
                                >
                                    disabled
                                </span>
                            )}
                            {provider.priority && (
                                <span
                                    style={{
                                        fontSize: "11px",
                                        color: "#0066cc",
                                        padding: "2px 6px",
                                        border: "1px solid #0066cc",
                                        borderRadius: "3px",
                                    }}
                                >
                                    priority: {provider.priority}
                                </span>
                            )}
                        </div>
                        <div
                            style={{
                                fontSize: "12px",
                                color: "#666",
                                marginBottom: "10px",
                            }}
                        >
                            <strong>Base URL:</strong> <code>{provider.baseURL}</code>
                        </div>
                        <div
                            style={{
                                fontSize: "12px",
                                color: "#666",
                                marginBottom: "10px",
                            }}
                        >
                            <strong>Keys:</strong> {provider.keys.length}
                        </div>
                        {provider.models && provider.models.length > 0 && (
                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "#666",
                                    marginBottom: "10px",
                                }}
                            >
                                <strong>Models:</strong>
                                <div
                                    style={{
                                        marginTop: "6px",
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "6px",
                                    }}
                                >
                                    {provider.models.map((model, index) => {
                                        const isSimple = typeof model === "string";
                                        const modelText = isSimple ? model : `${model.request} → ${model.destination}`;
                                        return (
                                            <span
                                                key={index}
                                                style={{
                                                    fontFamily: "monospace",
                                                    fontSize: "11px",
                                                    color: isSimple ? "#444" : "#5c3d00",
                                                    backgroundColor: isSimple ? "#e8f4ff" : "#fff3cd",
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                    border: isSimple ? "1px solid #b3d9ff" : "1px solid #ffc107",
                                                }}
                                            >
                                                {modelText}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            {provider.keys.map((key, index) => (
                                <div
                                    key={index}
                                    style={{
                                        fontFamily: "monospace",
                                        fontSize: "11px",
                                        color: "#666",
                                        backgroundColor: provider.enabled === false ? "#e8e8e8" : "#f9f9f9",
                                        padding: "8px",
                                        borderRadius: "4px",
                                        border: "1px solid #ddd",
                                        wordBreak: "break-all",
                                        lineHeight: "1.4",
                                    }}
                                >
                                    {key}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: "20px" }}>
                <a href="/dashboard">Back to Dashboard</a>
            </div>
        </div>
    );
};

app.get("/", (c) => {
    return c.html(<ProviderKeysList providers={apiConfig.providers} />);
});

export default app;
