const fs = require("fs");
const path = require("path");
const ttf2woff = require("ttf2woff");
const ttf2woff2Module = require("ttf2woff2");
const ttf2woff2 = ttf2woff2Module.default || ttf2woff2Module;

const FONTS_ROOT = path.resolve(process.cwd(), "src", "static", "fonts");
const FONTS_SCSS_PATH = path.resolve(process.cwd(), "src", "scss", "base", "_fonts.scss");

function toBuffer(data) {
  if (Buffer.isBuffer(data)) {
    return data;
  }

  if (data instanceof Uint8Array) {
    return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  }

  if (data && data.buffer instanceof ArrayBuffer) {
    return Buffer.from(data.buffer);
  }

  throw new Error("Unsupported binary format during font conversion");
}

async function writeFileIfChanged(targetPath, nextBuffer) {
  try {
    const prevBuffer = await fs.promises.readFile(targetPath);

    if (Buffer.compare(prevBuffer, nextBuffer) === 0) {
      return false;
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  await fs.promises.writeFile(targetPath, nextBuffer);
  return true;
}

function normalizeFontName(rawName) {
  const museoMatch = rawName.match(/^Museo Sans Cyrl\s+(\d+)(\s+Italic)?$/i);

  if (museoMatch) {
    const weight = museoMatch[1];
    const suffix = museoMatch[2] ? "Italic" : "";

    return `MuseoSansCyrl-${weight}${suffix}`;
  }

  return rawName
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function buildFontMeta(fileName) {
  const baseName = fileName.replace(/\.woff2$/i, "");
  const museoMatch = baseName.match(/^MuseoSansCyrl-(\d+)(Italic)?$/i);

  if (museoMatch) {
    return {
      id: baseName,
      family: "Museo Sans Cyrl",
      localPrimary: `Museo Sans Cyrl ${museoMatch[1]}${museoMatch[2] ? " Italic" : ""}`,
      localSecondary: baseName,
      weight: Number.parseInt(museoMatch[1], 10),
      style: museoMatch[2] ? "italic" : "normal",
    };
  }

  return {
    id: baseName,
    family: baseName,
    localPrimary: baseName,
    localSecondary: baseName,
    weight: 400,
    style: "normal",
  };
}

async function buildFontsScss() {
  if (!fs.existsSync(FONTS_ROOT)) {
    return;
  }

  const entries = await fs.promises.readdir(FONTS_ROOT, { withFileTypes: true });
  const woff2Files = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".woff2"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const blocks = woff2Files.map((fileName) => {
    const meta = buildFontMeta(fileName);
    const woffFileName = `${meta.id}.woff`;

    return [
      "@font-face {",
      `  font-family: "${meta.family}";`,
      `  font-style: ${meta.style};`,
      `  font-weight: ${meta.weight};`,
      "  font-display: swap;",
      `  src: local("${meta.localPrimary}"), local("${meta.localSecondary}"),`,
      `    url("../fonts/${fileName}") format("woff2"),`,
      `    url("../fonts/${woffFileName}") format("woff");`,
      "}",
      "",
    ].join("\n");
  });

  const nextScss = `${blocks.join("")}`.trimEnd() + "\n";
  await writeFileIfChanged(FONTS_SCSS_PATH, Buffer.from(nextScss, "utf8"));
}

async function collectTtfFiles(dirPath, acc = []) {
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await collectTtfFiles(fullPath, acc);
      continue;
    }

    if (entry.name === ".DS_Store") {
      await fs.promises.rm(fullPath, { force: true });
      continue;
    }

    if (entry.name.toLowerCase().endsWith(".ttf")) {
      acc.push(fullPath);
    }
  }

  return acc;
}

async function removeEmptyDirectories(dirPath, rootPath) {
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const nestedPath = path.join(dirPath, entry.name);
    await removeEmptyDirectories(nestedPath, rootPath);
  }

  if (dirPath === rootPath) {
    return;
  }

  const restEntries = await fs.promises.readdir(dirPath);

  if (restEntries.length === 0) {
    await fs.promises.rmdir(dirPath);
  }
}

async function convertFonts() {
  if (!fs.existsSync(FONTS_ROOT)) {
    return;
  }

  const ttfFiles = await collectTtfFiles(FONTS_ROOT);

  for (const ttfPath of ttfFiles) {
    const rawName = path.basename(ttfPath, ".ttf");
    const normalizedName = normalizeFontName(rawName);
    const targetTtfPath = path.join(FONTS_ROOT, `${normalizedName}.ttf`);
    const targetWoffPath = path.join(FONTS_ROOT, `${normalizedName}.woff`);
    const targetWoff2Path = path.join(FONTS_ROOT, `${normalizedName}.woff2`);
    const sourceBuffer = await fs.promises.readFile(ttfPath);

    if (ttfPath !== targetTtfPath) {
      await writeFileIfChanged(targetTtfPath, sourceBuffer);
      await fs.promises.rm(ttfPath, { force: true });
    }

    const woffResult = ttf2woff(new Uint8Array(sourceBuffer));
    const woff2Result = ttf2woff2(sourceBuffer);

    await writeFileIfChanged(targetWoffPath, toBuffer(woffResult));
    await writeFileIfChanged(targetWoff2Path, toBuffer(woff2Result));
  }

  const gitKeepPath = path.join(FONTS_ROOT, ".gitkeep");
  const rootEntries = await fs.promises.readdir(FONTS_ROOT);

  if (rootEntries.length > 1 && fs.existsSync(gitKeepPath)) {
    await fs.promises.rm(gitKeepPath, { force: true });
  }

  await removeEmptyDirectories(FONTS_ROOT, FONTS_ROOT);
  await buildFontsScss();
}

if (require.main === module) {
  convertFonts().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = convertFonts;
