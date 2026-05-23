import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const port = Number(process.env.PORT || 4173);
const root = process.cwd();

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host}`);

    if (url.pathname === "/api/rsvp" && request.method === "POST") {
      const body = await readBody(request);
      const payload = JSON.parse(body || "{}");

      if (!payload.name || !payload.email || !payload.attendance) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Missing required RSVP fields" }));
        return;
      }

      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ ok: true, localPreview: true }));
      return;
    }

    const requestedPath = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
    const file = resolve(root, requestedPath);

    if (!file.startsWith(root)) {
      throw new Error("Refusing to serve files outside the project");
    }

    const content = await readFile(file);

    response.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
    response.end(content);
  } catch (error) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`Wedding preview: http://localhost:${port}`);
});
