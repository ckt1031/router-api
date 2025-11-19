import { Hono } from "hono";
import { FC } from "hono/jsx";
import apiConfig from "../../../data/api.json";

const app = new Hono();

interface UserKey {
    name: string;
    key: string;
    allowedProviders?: string[];
    allowedModels?: string[];
}

const Layout: FC<{ children: any }> = ({ children }) => {
    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>User Keys - Dashboard</title>
                <link 
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" 
                    rel="stylesheet" 
                    integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" 
                    crossorigin="anonymous" 
                />
                <script dangerouslySetInnerHTML={{ __html: `
                    (function() {
                        const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
                        const updateTheme = (e) => {
                            document.documentElement.setAttribute('data-bs-theme', e.matches ? 'dark' : 'light');
                        };
                        updateTheme(darkMode);
                        darkMode.addEventListener('change', updateTheme);
                    })();
                ` }} />
            </head>
            <body class="bg-body-tertiary">
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

const UserKeysList: FC<{ userKeys: UserKey[] }> = ({ userKeys }) => {
    return (
        <Layout>
            <div class="container py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>User Keys</h2>
                    <a href="/dashboard" class="btn btn-sm btn-outline-primary">Back</a>
                </div>
                
                <div class="d-flex flex-column gap-3">
                    {userKeys.map((userKey, index) => (
                        <div key={index} class="card">
                            <div class="card-body">
                                <h5 class="mb-3">{userKey.name}</h5>
                                
                                <div class="mb-3">
                                    <small class="text-body-secondary d-block mb-1"><strong>API Key:</strong></small>
                                    <code class="small text-break">{userKey.key}</code>
                                </div>
                                
                                {(userKey.allowedProviders || userKey.allowedModels) && (
                                    <div>
                                        {userKey.allowedProviders && (
                                            <div class="mb-2">
                                                <small class="text-body-secondary d-block mb-1"><strong>Allowed Providers:</strong></small>
                                                <div class="d-flex flex-wrap gap-1">
                                                    {userKey.allowedProviders.map((provider, idx) => (
                                                        <span key={idx} class="badge bg-success">{provider}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {userKey.allowedModels && (
                                            <div>
                                                <small class="text-body-secondary d-block mb-1"><strong>Allowed Models:</strong></small>
                                                <div class="d-flex flex-wrap gap-1">
                                                    {userKey.allowedModels.map((model, idx) => (
                                                        <span key={idx} class="badge bg-info text-dark">{model}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

app.get("/", (c) => {
    return c.html(<UserKeysList userKeys={apiConfig.userKeys} />);
});

export default app;
