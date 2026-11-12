import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { Readable } from "node:stream";
import { defineConfig, loadEnv, type Connect, type Plugin } from "vite";
import { createContactHandler } from "./server/contact.ts";
import { createGmailDelivery } from "./server/contact-mail.ts";

function contactApi(mode: string): Plugin {
  function install(server: { middlewares: Connect.Server }) {
    const handle = createContactHandler(
      createGmailDelivery(loadEnv(mode, process.cwd(), "GMAIL_")),
    );
    server.middlewares.use("/api/contact", async (req, res, next) => {
      try {
        const headers = new Headers();
        for (const [name, value] of Object.entries(req.headers)) {
          if (value !== undefined)
            headers.set(name, Array.isArray(value) ? value.join(", ") : value);
        }
        const request = new Request(`http://${req.headers.host}/api/contact`, {
          method: req.method,
          headers,
          ...(req.method === "POST"
            ? { body: Readable.toWeb(req), duplex: "half" as const }
            : {}),
        });
        const response = await handle(request);
        res.writeHead(response.status, Object.fromEntries(response.headers));
        res.end(await response.text());
      } catch (error) {
        next(error);
      }
    });
  }

  return {
    name: "contact-api",
    configureServer: install,
    configurePreviewServer: install,
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), contactApi(mode)],
  resolve: {
    tsconfigPaths: true,
  },
}));
