import { build } from "esbuild";
import { lstatSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("./", import.meta.url)));
const args = process.argv.slice(2);
const bundleName = "markdown-tree-view.mjs";
const distribution = join(root, "dist/markdown-tree-view");
const includedFiles = [
    "SKILL.md",
    "README.md",
    "LICENSE.txt",
    "docs/installation.md",
    "docs/hosting.md",
    "agents/openai.yaml",
    "examples/guide.md",
];

function distributionIssues(files: Map<string, Buffer>): string[] {
    for (const directory of [dirname(distribution), distribution]) {
        const metadata = lstatSync(directory, { throwIfNoEntry: false });
        if (metadata && !metadata.isDirectory())
            throw new Error(`Distribution must use regular directories: ${directory}`);
    }
    const directories = new Set<string>();
    for (const relative of files.keys()) {
        let directory = dirname(relative).replaceAll("\\", "/");
        while (directory !== ".") {
            directories.add(directory);
            directory = dirname(directory).replaceAll("\\", "/");
        }
    }
    const issues: string[] = [];
    function inspect(relative: string): void {
        const directory = join(distribution, relative);
        if (!lstatSync(directory, { throwIfNoEntry: false })) return;
        for (const entry of readdirSync(directory, { withFileTypes: true })) {
            const child = relative ? `${relative}/${entry.name}` : entry.name;
            if (entry.isDirectory() && directories.has(child)) inspect(child);
            else if (!(entry.isFile() && files.has(child))) issues.push(`Unexpected entry: ${child}`);
        }
    }
    inspect("");
    return issues;
}

function dependencyDirectory(input: string): string | undefined {
    let directory = dirname(resolve(root, input));
    while (directory !== root) {
        try {
            const pkg: unknown = JSON.parse(readFileSync(join(directory, "package.json"), "utf8"));
            // Nested package.json files may only select a module format. Keep
            // walking until the owning package is found, including linked packages.
            if (
                typeof pkg === "object" &&
                pkg !== null &&
                "name" in pkg &&
                typeof pkg.name === "string" &&
                "version" in pkg &&
                typeof pkg.version === "string"
            )
                return directory;
        } catch (error) {
            if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
        }
        const parent = dirname(directory);
        if (parent === directory) throw new Error(`No package metadata found for bundled input: ${input}`);
        directory = parent;
    }
    return undefined;
}

function dependencyNotice(directory: string): string {
    const pkg: unknown = JSON.parse(readFileSync(join(directory, "package.json"), "utf8"));
    if (
        typeof pkg !== "object" ||
        pkg === null ||
        !("name" in pkg) ||
        typeof pkg.name !== "string" ||
        !("version" in pkg) ||
        typeof pkg.version !== "string" ||
        !("license" in pkg) ||
        typeof pkg.license !== "string"
    )
        throw new Error(`Invalid bundled dependency metadata: ${directory}`);
    const license = readdirSync(directory).find((name) => /^licen[cs]e(?:[.-].*)?$/iu.test(name));
    if (!license) throw new Error(`No license file found for bundled dependency ${pkg.name}`);
    return `${pkg.name} ${pkg.version}\nLicense: ${pkg.license}\n\n${readFileSync(join(directory, license), "utf8").replace(/\r\n?/gu, "\n").trim()}\n`;
}

try {
    if (args.length > 1 || (args.length === 1 && args[0] !== "--check"))
        throw new Error("Usage: npm run build -- [--check]");
    const check = args.includes("--check");
    const { css, script, license, faviconSvg, faviconIco } = await import("./src/assets.ts");
    const result = await build({
        absWorkingDir: root,
        entryPoints: [join(root, "src/cli.ts")],
        outfile: join(distribution, `scripts/${bundleName}`),
        bundle: true,
        platform: "node",
        format: "esm",
        target: "node24",
        write: false,
        metafile: true,
        define: {
            BUNDLED_CSS: JSON.stringify(css),
            BUNDLED_JS: JSON.stringify(script),
            BUNDLED_LICENSE: JSON.stringify(license),
            BUNDLED_FAVICON_SVG: JSON.stringify(faviconSvg),
            BUNDLED_FAVICON_ICO: JSON.stringify(faviconIco),
        },
    });
    const packages = [
        ...new Set(
            Object.keys(result.metafile.inputs).flatMap((input) => {
                const directory = dependencyDirectory(input);
                return directory ? [directory] : [];
            })
        ),
    ];
    const notices = [...new Set(packages.map(dependencyNotice))]
        .sort()
        .join("\n----------------------------------------\n\n");
    const bundle = result.outputFiles[0];
    if (!bundle || result.outputFiles.length !== 1) throw new Error("Expected one self-contained CLI bundle.");
    // Carry full notices even when the generated CLI is distributed by itself.
    const licenseText = `Markdown Tree View\n\n${license}\n\nThird-party notices\n\n${notices}`;
    if (licenseText.includes("*/")) throw new Error("License text cannot be safely embedded in a JavaScript comment.");
    const standalone = Buffer.from(`${bundle.text}\n/*!\n${licenseText}\n*/\n`, "utf8");
    const files = new Map([
        ...includedFiles.map((relative): [string, Buffer] => [relative, readFileSync(join(root, relative))]),
        [`scripts/${bundleName}`, standalone],
        ["THIRD-PARTY-NOTICES.txt", Buffer.from(notices, "utf8")],
    ]);
    const issues = distributionIssues(files);
    if (issues.length) {
        for (const issue of issues) console.error(issue);
        throw new Error("Inspect unexpected distribution entries before rebuilding; no files were changed.");
    }
    let mismatch = false;
    for (const [relative, expected] of files) {
        const path = join(distribution, relative);
        let current: Buffer | undefined;
        try {
            current = readFileSync(path);
        } catch (error) {
            if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
        }
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
    else console.log(`${check ? "Up to date" : "Built"}: dist/markdown-tree-view/`);
} catch (error) {
    console.error(`build: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 2;
}
