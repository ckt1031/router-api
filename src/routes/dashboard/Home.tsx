import { Hono } from "hono";
import { FC } from "hono/jsx";
import { OidcAuth } from "@hono/oidc-auth";
import type { DashboardEnv } from "./index";

const app = new Hono<DashboardEnv>();

const BigTitle: FC<{ auth: OidcAuth }> = ({ auth }) => {
    const email = auth.email!.toString();
    const expiryDate = new Date(auth.rtkexp * 1000);
    const expiryDateString = expiryDate.toLocaleString();

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxWidth: "800px",
            margin: "0 auto",
            padding: "20px",
            fontFamily: "sans-serif",
        }}>
            <h3>
                Hello {email}!
            </h3>
            <p>
                Expiry: {expiryDateString}
            </p>
            <a href="/dashboard/keys">User Keys</a>
            <a href="/dashboard/providers">Provider Keys</a>

            <form action="/dashboard/logout" method="get">
                <button type="submit" style={{ marginTop: "25px" }}>
                    Logout
                </button>
            </form>
        </div>
    )
}

app.get('/', (c) => {
    const auth = c.get("auth");

    if (!auth.email) {
        return c.text("You are not logged in", 401);
    }

    return c.html(<BigTitle auth={auth} />)
})

export default app;