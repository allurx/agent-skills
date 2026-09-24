#!/usr/bin/env node
import { mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { renderDocument } from "./render.ts";

const help = `Markdown Tree View

Usage: markdown-tree-view --input <file.md> --output <file.html> [--check] [--allow-cloudflare-analytics]
       node scripts/markdown-tree-view.mjs -i <file.md> -o <file.html>

Options:
  -i, --input PATH    UTF-8 Markdown input (one file)
  -o, --output PATH   Self-contained HTML output (one file)
  --check            Compare only; never write files or create directories
  --allow-cloudflare-analytics
                     Permit hosting-injected Cloudflare Web Analytics (no script added)
  -h, --help         Show this help

Exit codes: 0 = generated / up to date; 1 = check differs / missing output;
            2 = invalid arguments, encoding, read or write failure.
`;

interface ConversionOptions {
    input: string;
    output: string;
    check: boolean;
    allowCloudflareAnalytics: boolean;
}

function parseArgs(args: string[]): ConversionOptions | "help" {
    if (args.length === 1 && (args[0] === "--help" || args[0] === "-h")) return "help";
    const paths: Partial<Pick<ConversionOptions, "input" | "output">> = {};
    let check = false;
    let allowCloudflareAnalytics = false;
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === "--check" && !check) {
            check = true;
        } else if (arg === "--allow-cloudflare-analytics" && !allowCloudflareAnalytics) {
            allowCloudflareAnalytics = true;
        } else if (arg === "--input" || arg === "-i" || arg === "--output" || arg === "-o") {
            const key = arg === "--input" || arg === "-i" ? "input" : "output";
            const value = args[++i];
            if (paths[key] || !value || value.startsWith("-")) throw new Error(`Missing or duplicate ${key} path.`);
            paths[key] = resolve(value);
        } else {
            throw new Error(`Unknown or duplicate argument: ${String(arg)}`);
        }
    }
    if (!paths.input || !paths.output) throw new Error("Both --input and --output are required. Use --help for usage.");
    return { input: paths.input, output: paths.output, check, allowCloudflareAnalytics };
}

function guardDistinctFiles(input: string, output: string): void {
    const source = statSync(input);
    if (!source.isFile()) throw new Error(`Input is not a regular file: ${input}`);
    if (input === output) throw new Error("Input and output must be different files.");
    try {
        const target = statSync(output);
        if (!target.isFile()) throw new Error(`Output is not a regular file: ${output}`);
        if (realpathSync(input) === realpathSync(output) || (source.dev === target.dev && source.ino === target.ino)) {
            throw new Error("Input and output must be different files (including linked aliases).");
        }
    } catch (error) {
        if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
    }
}

try {
    const options = parseArgs(process.argv.slice(2));
    if (options === "help") {
        process.stdout.write(help);
    } else {
        guardDistinctFiles(options.input, options.output);
        const bytes = readFileSync(options.input);
        // Preserve a UTF-8 BOM for source hashing while rejecting lossy decoding.
        const markdown = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
        const expected = Buffer.from(
            renderDocument(markdown, {
                sourceName: basename(options.input),
                allowCloudflareAnalytics: options.allowCloudflareAnalytics,
            }),
            "utf8"
        );
        let current: Buffer | undefined;
        try {
            current = readFileSync(options.output);
        } catch (error) {
            if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
        }
        if (current?.equals(expected)) {
            console.log(`Up to date: ${options.output}`);
        } else if (options.check) {
            console.error(`Output is missing or differs: ${options.output}`);
            process.exitCode = 1;
        } else {
            mkdirSync(dirname(options.output), { recursive: true });
            writeFileSync(options.output, expected);
            console.log(`Generated: ${options.output}`);
        }
    }
} catch (error) {
    console.error(`markdown-tree-view: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 2;
}
