import { Hono } from "hono";
import { FC } from "hono/jsx";
import apiConfig from "../../../data/api.json";

const app = new Hono();

interface Provider {
    name: string;
    baseURL: string;
    keys: string[];
    enabled?: boolean;
    priority?: number;
    models?: (string | { request: string; destination: string })[];
}

const Layout: FC<{ children: any }> = ({ children }) => {
    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Provider Keys - Dashboard</title>
                <link 
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" 
                    rel="stylesheet" 
                    integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" 
                    crossorigin="anonymous" 
                />
            </head>
            <body class="bg-light">
                {children}
                <script 
                    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" 
                    integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" 
                    crossorigin="anonymous"
                ></script>
            </body>
        </html>
    );
};

const ProviderKeysList: FC<{ providers: Record<string, Provider> }> = ({ providers }) => {
    const providerEntries = Object.entries(providers);

    return (
        <Layout>
            <div class="container py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Provider Keys</h2>
                    <a href="/dashboard" class="btn btn-sm btn-outline-primary">Back</a>
                </div>
                
                <div class="d-flex flex-column gap-3">
                    {providerEntries.map(([providerId, provider]) => (
                        <div key={providerId} class={`card ${provider.enabled === false ? 'opacity-50' : ''}`}>
                            <div class="card-body">
                                <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
                                    <h5 class="mb-0">{provider.name}</h5>
                                    <span class="badge bg-secondary">{providerId}</span>
                                    {provider.enabled === false && (
                                        <span class="badge bg-warning text-dark">Disabled</span>
                                    )}
                                    {provider.priority && (
                                        <span class="badge bg-info">Priority: {provider.priority}</span>
                                    )}
                                </div>
                                
                                <div class="mb-2">
                                    <small class="text-muted"><strong>Base URL:</strong></small>
                                    <div><code class="text-break">{provider.baseURL}</code></div>
                                </div>
                                
                                <div class="mb-2">
                                    <small class="text-muted"><strong>Keys:</strong> {provider.keys.length}</small>
                                </div>
                                
                                {provider.models && provider.models.length > 0 && (
                                    <div class="mb-3">
                                        <small class="text-muted d-block mb-1"><strong>Models:</strong></small>
                                        <div class="d-flex flex-wrap gap-1">
                                            {provider.models.map((model, index) => {
                                                const isSimple = typeof model === "string";
                                                const modelText = isSimple ? model : `${model.request} → ${model.destination}`;
                                                return (
                                                    <span key={index} class={`badge ${isSimple ? 'bg-primary' : 'bg-warning text-dark'}`}>
                                                        {modelText}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                
                                <div class="accordion" id={`accordion-${providerId}`}>
                                    <div class="accordion-item">
                                        <h2 class="accordion-header">
                                            <button 
                                                class="accordion-button collapsed" 
                                                type="button" 
                                                data-bs-toggle="collapse" 
                                                data-bs-target={`#collapse-${providerId}`}
                                                aria-expanded="false"
                                                aria-controls={`collapse-${providerId}`}
                                            >
                                                View API Keys ({provider.keys.length})
                                            </button>
                                        </h2>
                                        <div 
                                            id={`collapse-${providerId}`} 
                                            class="accordion-collapse collapse"
                                            data-bs-parent={`#accordion-${providerId}`}
                                        >
                                            <div class="accordion-body">
                                                <div class="d-flex flex-column gap-2">
                                                    {provider.keys.map((key, index) => (
                                                        <code key={index} class="small text-break">{key}</code>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

app.get("/", (c) => {
    return c.html(<ProviderKeysList providers={apiConfig.providers} />);
});

export default app;
