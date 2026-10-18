/*
 * Copyright 2026 allurx
 * SPDX-License-Identifier: Apache-2.0
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { appendFileSync, copyFileSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";

await test("公开 CLI 生成 HTML，并只读检查当前与过期的产物", () => {
    const directory = mkdtempSync(join(tmpdir(), "markdown-tree-view-test-"));
    const input = join(directory, "guide.md");
    const output = join(directory, "guide.html");
    const cli = resolve("dist/markdown-tree-view/scripts/markdown-tree-view.mjs");
    const run = (expected: number, ...options: string[]): void => {
        const result = spawnSync(process.execPath, [cli, "--input", input, "--output", output, ...options], {
            encoding: "utf8",
        });
        assert.ifError(result.error);
        assert.equal(result.status, expected, result.stderr || result.stdout);
    };

    try {
        copyFileSync("examples/guide.md", input);
        run(0);
        const generated = readFileSync(output);
        const html = generated.toString("utf8");
        assert.ok(html.includes("<title>Project Handbook &amp; Notes · Markdown Tree View</title>"));
        assert.deepEqual(
            [...html.matchAll(/data-heading-level="(\d+)"/g)].map((match) => Number(match[1])),
            [1, 2, 3, 3, 5, 2, 2, 2, 2]
        );
        assert.ok(
            html.includes(
                "&lt;strong&gt;Raw HTML is displayed as text instead of executing or changing the page.&lt;/strong&gt;"
            )
        );
        run(0, "--check");

        appendFileSync(input, "\n## CI changed input\n\nThis output is now stale.\n");
        run(1, "--check");
        assert.deepEqual(readFileSync(output), generated, "--check must not overwrite stale output");
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});
