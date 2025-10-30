import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import dashboard from "./routes/dashboard/index";
import { handleProxy, proxyList } from "./routes/proxy";
import v1 from "./routes/v1/index";

const app = new Hono();
app.use(secureHeaders());

app.get("/health", (c) => c.text("OK"));
app.route("/dashboard", dashboard);

// CORS for rest of routes
app.use(cors());

// Proxy routes
for (const proxy of proxyList) {
	app.all(`${proxy.path}/*`, (c) => {
		return handleProxy(c, proxy.path, proxy.host);
	});
}

app.route("/v1", v1);

export default app;
