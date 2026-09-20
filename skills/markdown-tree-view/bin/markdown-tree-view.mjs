#!/usr/bin/env node
import { mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { renderDocument } from "../src/render.mjs";

const help = `Markdown Tree View

Usage: markdown-tree-view --input <file.md> --output <file.html> [--check]
       node bin/markdown-tree-view.mjs -i <file.md> -o <file.html>

Options:
  -i, --input PATH    UTF-8 Markdown input (one file)
  -o, --output PATH   Self-contained HTML output (one file)
  --check            Compare only; never write files or create directories
  -h, --help         Show this help

Exit codes: 0 = generated / up to date; 1 = check differs / missing output;
            2 = invalid arguments, encoding, read or write failure.
`;

function parseArgs(args) {
  if (args.length === 1 && ["--help", "-h"].includes(args[0])) return { help: true };
  const result = { check: false };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--check" && !result.check) {
      result.check = true;
    } else if (["--input", "-i", "--output", "-o"].includes(arg)) {
      const key = ["--input", "-i"].includes(arg) ? "input" : "output";
      const value = args[++i];
      if (result[key] || !value || value.startsWith("-")) throw new Error(`Missing or duplicate ${key} path.`);
      result[key] = resolve(value);
    } else {
      throw new Error(`Unknown or duplicate argument: ${arg}`);
    }
  }
  if (!result.input || !result.output) throw new Error("Both --input and --output are required. Use --help for usage.");
  return result;
}

function guardDistinctFiles(input, output) {
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
    if (error.code !== "ENOENT") throw error;
  }
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(help);
  } else {
    guardDistinctFiles(options.input, options.output);
    const bytes = readFileSync(options.input);
    // Preserve a UTF-8 BOM for source hashing while rejecting lossy decoding.
    const markdown = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
    const expected = Buffer.from(renderDocument(markdown, { sourceName: basename(options.input) }), "utf8");
    let current;
    try { current = readFileSync(options.output); }
    catch (error) { if (error.code !== "ENOENT") throw error; }
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
  console.error(`markdown-tree-view: ${error.message}`);
  process.exitCode = 2;
}
