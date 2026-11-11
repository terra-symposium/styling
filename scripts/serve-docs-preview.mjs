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
const server = createServer(async (r, v) => {
  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(r.url ?? "/", "http://localhost").pathname,
    );
  } catch {
    v.writeHead(400).end("Bad request");
    return;
  }
  if (pathname === "/" || pathname === base.slice(0, -1)) {
    v.writeHead(308, { location: base }).end();
    return;
  }
  const file = pathname.startsWith(base) ? await resolveFile(pathname) : null;
  const result =
    file ??
    (await (async () => {
      try {
        const details = await stat(notFound);
        return { file: notFound, details };
      } catch {
        return null;
      }
    })());
  if (!result) {
    v.writeHead(404).end("Not found");
    return;
  }
  v.writeHead(file ? 200 : 404, {
    "content-length": result.details.size,
    "content-type":
      mimeTypes[extname(result.file).toLowerCase()] ??
      "application/octet-stream",
  });
  if (r.method === "HEAD") v.end();
  else createReadStream(result.file).pipe(v);
});

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 *
 * @param pathname
 *
 * @return
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
server.listen(port, () => {
  console.log(
    `Styling Docs preview running at http://localhost:${port}${base}`,
  );
});
