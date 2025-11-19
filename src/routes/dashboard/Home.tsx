import { Hono } from "hono";
import { FC } from "hono/jsx";
import { OidcAuth } from "@hono/oidc-auth";
import type { DashboardEnv } from "./index";

const app = new Hono<DashboardEnv>();

const Layout: FC<{ children: any }> = ({ children }) => {
    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Dashboard</title>
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

const BigTitle: FC<{ auth: OidcAuth }> = ({ auth }) => {
    const email = auth.email!.toString();

    return (
        <Layout>
            <div class="container py-4" style={{ maxWidth: "600px" }}>
                <h3 class="mb-4">Hello {email}!</h3>
                
                <div class="d-flex flex-column gap-3">
                    <a href="/dashboard/keys" class="btn btn-primary">User Keys</a>
                    <a href="/dashboard/providers" class="btn btn-primary">Provider Keys</a>
                    
                    <form action="/dashboard/logout" method="get" class="mt-3">
                        <button type="submit" class="btn btn-outline-danger w-100">Logout</button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

app.get('/', (c) => {
    const auth = c.get("auth");

    if (!auth.email) {
        return c.text("You are not logged in", 401);
    }

    return c.html(<BigTitle auth={auth} />)
})

export default app;