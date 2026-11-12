/**
 * scripts/serve-docs-preview.mjs
 * Serves the built Styling Docs site beneath its configured base path.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { access, readFile, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifest = JSON.parse(
  await readFile(resolve(root, "package.json"), "utf8"),
);
const output = resolve(root, manifest.docs?.out ?? "dist/docs");
const rawBase = manifest.docs?.base ?? "/";
const base = `/${rawBase.replace(/^\/+|\/+$/g, "")}/`.replace("//", "/");
const port = Number(process.argv[2] ?? "2030");
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};
const notFound = resolve(output, "404.html");
/** Resolves a built-site route and streams its file or fallback page.
 *
 * @param request Incoming HTTP request.
 * @param response HTTP response used to send the result.
 */
async function handleRequest(request, response) {
  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(request.url ?? "/", "http://localhost").pathname,
    );
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }
  if (pathname === "/" || pathname === base.slice(0, -1)) {
    response.writeHead(308, { location: base }).end();
    return;
  }
  const file = pathname.startsWith(base) ? await resolveFile(pathname) : null;
  let result = file;
  if (!result) {
    try {
      const details = await stat(notFound);
      result = { file: notFound, details };
    } catch {
      result = null;
    }
  }
  if (!result) {
    response.writeHead(404).end("Not found");
    return;
  }
  response.writeHead(file ? 200 : 404, {
    "content-length": result.details.size,
    "content-type":
      mimeTypes[extname(result.file).toLowerCase()] ??
      "application/octet-stream",
  });
  if (request.method === "HEAD") response.end();
  else createReadStream(result.file).pipe(response);
}
/** Logs the local address after the preview server begins listening. */
function logServerStarted() {
  console.log(
    `Styling Docs preview running at http://localhost:${port}${base}`,
  );
}
const server = createServer(handleRequest);

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/** Resolves a request pathname within the built docs output directory.
 *
 * @param pathname Decoded pathname beginning with the configured docs base.
 *
 * @return The requested file and its metadata, or null when no safe file exists.
 */
async function resolveFile(pathname) {
  const relative = pathname.slice(base.length);
  const candidate = resolve(output, relative || "index.html");
  if (candidate !== output && !candidate.startsWith(`${output}${sep}`))
    return null;
  for (const file of [candidate, resolve(candidate, "index.html")]) {
    try {
      const details = await stat(file);
      if (details.isFile()) return { file, details };
      if (details.isDirectory()) continue;
    } catch {
      // Try the index file for directory routes and extensionless page paths.
    }
  }
  return null;
}
await access(output);
server.listen(port, logServerStarted);
