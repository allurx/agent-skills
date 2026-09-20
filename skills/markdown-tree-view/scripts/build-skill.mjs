import { build } from "esbuild";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);

try {
  if (args.length > 1 || (args.length === 1 && args[0] !== "--check")) throw new Error("Usage: npm run build:skill -- [--check]");
  const check = args.includes("--check");
  const result = await build({
    absWorkingDir: root,
    entryPoints: [join(root, "bin/markdown-tree-view.mjs")],
    outfile: "scripts/markdown-tree-view.mjs",
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node24",
    tsconfigRaw: {},
    write: false,
    metafile: true,
    define: {
      BUNDLED_CSS: JSON.stringify(readFileSync(join(root, "src/view.css"), "utf8")),
      BUNDLED_JS: JSON.stringify(readFileSync(join(root, "src/view.js"), "utf8")),
    },
  });
  const packages = [...new Set(Object.keys(result.metafile.inputs).flatMap((input) => {
    const match = input.replaceAll("\\", "/").match(/^(node_modules\/(?:@[^/]+\/)?[^/]+)\//u);
    return match ? [match[1]] : [];
  }))].sort();
  const notices = packages.map((path) => {
    const directory = resolve(root, path);
    const pkg = JSON.parse(readFileSync(join(directory, "package.json"), "utf8"));
    const license = readdirSync(directory).find((name) => /^licen[cs]e(?:[.-].*)?$/iu.test(name));
    if (!license) throw new Error(`No license file found for bundled dependency ${pkg.name}`);
    return `${pkg.name} ${pkg.version}\nLicense: ${pkg.license}\n\n${readFileSync(join(directory, license), "utf8").replace(/\r\n?/gu, "\n").trim()}\n`;
  }).join("\n----------------------------------------\n\n");
  const files = new Map([
    ["scripts/markdown-tree-view.mjs", result.outputFiles[0].contents],
    ["THIRD-PARTY-NOTICES.txt", Buffer.from(notices, "utf8")],
  ]);
  let mismatch = false;
  for (const [relative, expected] of files) {
    const path = join(root, relative);
    let current;
    try { current = readFileSync(path); }
    catch (error) { if (error.code !== "ENOENT") throw error; }
    if (current?.equals(Buffer.from(expected))) continue;
    if (check) {
      console.error(`Missing or differs: ${relative}`);
      mismatch = true;
    } else {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, expected);
    }
  }
  if (mismatch) process.exitCode = 1;
  else console.log(`${check ? "Up to date" : "Built"}: markdown-tree-view`);
} catch (error) {
  console.error(`build-skill: ${error.message}`);
  process.exitCode = 2;
}
