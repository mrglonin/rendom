const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const chokidar = require("chokidar");

const root = path.resolve(__dirname, "..");
const srcDir = path.join(root, "src");
const distDir = path.join(root, "dist");
const port = 3000;
const host = "127.0.0.1";
const reloadClients = new Set();

let isBuilding = false;
let rebuildQueued = false;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
};

const reloadScript = `
<script>
  (() => {
    const source = new EventSource("/__reload");
    source.addEventListener("reload", () => window.location.reload());
  })();
</script>
`;

function runBuild() {
  return new Promise((resolve, reject) => {
    const build = spawn("npm", ["run", "build"], {
      cwd: root,
      stdio: "inherit",
      shell: true,
    });

    build.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Build failed with code ${code}`));
    });
  });
}

async function buildProject() {
  if (isBuilding) {
    rebuildQueued = true;
    return;
  }

  isBuilding = true;

  try {
    await runBuild();
    broadcastReload();
  } catch (error) {
    console.error(error.message);
  } finally {
    isBuilding = false;

    if (rebuildQueued) {
      rebuildQueued = false;
      buildProject();
    }
  }
}

function broadcastReload() {
  for (const client of reloadClients) {
    client.write("event: reload\n");
    client.write("data: updated\n\n");
  }
}

function serveHtml(filePath, response) {
  fs.readFile(filePath, "utf8", (error, content) => {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Server error");
      return;
    }

    const html = content.includes("</body>")
      ? content.replace("</body>", `${reloadScript}</body>`)
      : `${content}${reloadScript}`;

    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(html);
  });
}

function serveFile(filePath, response) {
  const extname = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extname] || "application/octet-stream";

  if (extname === ".html") {
    serveHtml(filePath, response);
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Server error");
      return;
    }

    response.writeHead(200, { "Content-Type": contentType });
    response.end(content);
  });
}

function handleReloadStream(response) {
  response.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  response.write("retry: 300\n\n");
  reloadClients.add(response);

  response.on("close", () => {
    reloadClients.delete(response);
  });
}

function createServer() {
  const server = http.createServer((request, response) => {
    if (request.url === "/__reload") {
      handleReloadStream(response);
      return;
    }

    const requestPath = request.url === "/" ? "/index.html" : request.url;
    const safePath = path.normalize(decodeURIComponent(requestPath)).replace(/^(\.\.[/\\])+/, "");
    const filePath = path.join(distDir, safePath);

    fs.stat(filePath, (error, stats) => {
      if (!error && stats.isFile()) {
        serveFile(filePath, response);
        return;
      }

      const fallback = path.join(distDir, "index.html");
      fs.stat(fallback, (fallbackError) => {
        if (fallbackError) {
          response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          response.end("File not found");
          return;
        }

        serveFile(fallback, response);
      });
    });
  });

  server.listen(port, host, () => {
    console.log(`Dev server started: http://${host}:${port}`);
    console.log("Watching src for changes...");
    console.log("Press Ctrl+C to stop.");
  });
}

function createWatcher() {
  const watcher = chokidar.watch(srcDir, {
    ignoreInitial: true,
  });

  watcher.on("all", (_, changedPath) => {
    console.log(`Changed: ${path.relative(root, changedPath)}`);
    buildProject();
  });
}

runBuild()
  .then(() => {
    createServer();
    createWatcher();
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
