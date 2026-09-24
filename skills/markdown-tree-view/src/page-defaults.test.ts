import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
    copyFileSync,
    existsSync,
    mkdtempSync,
    readFileSync,
    readdirSync,
    rmSync,
    statSync,
    utimesSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { renderDocument } from "./render.ts";

function headOf(html: string): string {
    const head = /<head>([\s\S]*?)<\/head>/u.exec(html)?.[1];
    assert.ok(head, "Generated page must contain a head");
    return head;
}

function attribute(tag: string, name: string): string | undefined {
    return new RegExp(`\\s${name}="([^"]*)"`, "u").exec(tag)?.[1];
}

function metaTags(html: string, name: string): string[] {
    return [...headOf(html).matchAll(/<meta\s[^>]*>/gu)]
        .map(([tag]) => tag)
        .filter((tag) => attribute(tag, "name") === name);
}

function decodeText(text: string): string {
    const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" };
    return text.replace(/&(amp|lt|gt|quot|#39);/gu, (entity, name: string) => entities[name] ?? entity);
}

function metadata(html: string): { title: string; description: string } {
    const title = /<title>([^<]*)<\/title>/u.exec(headOf(html))?.[1];
    assert.notEqual(title, undefined, "Title must contain only escaped text");
    const descriptions = metaTags(html, "description");
    assert.equal(descriptions.length, 1, "Page must have exactly one description");
    const description = attribute(descriptions[0] ?? "", "content");
    assert.notEqual(description, undefined);
    return { title: decodeText(title ?? ""), description: decodeText(description ?? "") };
}

const titles = [
    {
        name: "first nonempty document-level H1 wins over lower levels and later H1s",
        markdown: "## Earlier section\n\n# Primary title\n\n# Later title\n",
        expected: "Primary title",
    },
    {
        name: "inline formatting, entities, code, links and image alt become plain text",
        markdown: "# **Bold** _emphasis_ `code` &amp; [link](https://example.com) ![image *alt*](icon.png)\n",
        expected: "Bold emphasis code & link image alt",
    },
    {
        name: "blocked relative link destination is not part of the title",
        markdown: "# Read [guide](./private-path.md)\n",
        expected: "Read guide",
    },
    {
        name: "Setext H1 collapses line breaks and whitespace",
        markdown: "  First   line\nsecond\tline\n================\n",
        expected: "First line second line",
    },
    {
        name: "empty and entity-whitespace H1s are skipped",
        markdown: "#\n\n# &nbsp;\n\n# Usable title\n",
        expected: "Usable title",
    },
    {
        name: "H1s nested in quotes and lists do not override document H1",
        markdown: "> # Quoted title\n\n- # List title\n\n# Document title\n",
        expected: "Document title",
    },
    {
        name: "UTF-8 BOM does not hide the first heading",
        markdown: "\uFEFF# BOM title\n",
        expected: "BOM title",
    },
];

for (const { name, markdown, expected } of titles) {
    await test(name, () => {
        assert.deepEqual(metadata(renderDocument(markdown, { sourceName: "fallback.md" })), {
            title: `${expected} · Markdown Tree View`,
            description: `《${expected}》的 Markdown 折叠树阅读视图。`,
        });
    });
}

for (const markdown of ["", "Only body.", "## Section\n", "#\n\n# &nbsp;\n", "> # Quote\n\n- # List\n"]) {
    await test(`missing usable document H1 falls back to filename: ${JSON.stringify(markdown)}`, () => {
        assert.deepEqual(metadata(renderDocument(markdown, { sourceName: "notes & plans.md" })), {
            title: "notes & plans.md · Markdown Tree View",
            description: "《notes & plans.md》的 Markdown 折叠树阅读视图。",
        });
    });
}

await test("title and description escape hostile heading and filename text without adding markup", () => {
    const hostile = "</title><script>alert(1)</script><img src=x onerror=alert(2)> \"&'";
    for (const html of [renderDocument(`# ${hostile}\n`), renderDocument("Body", { sourceName: hostile })]) {
        assert.deepEqual(metadata(html), {
            title: `${hostile} · Markdown Tree View`,
            description: `《${hostile}》的 Markdown 折叠树阅读视图。`,
        });
        const head = headOf(html);
        assert.equal([...head.matchAll(/<title>/gu)].length, 1);
        assert.equal([...head.matchAll(/<\/title>/gu)].length, 1);
        assert.doesNotMatch(head, /<script\b|<img\b/u);
        assert.ok(head.includes("&lt;/title&gt;"));
        assert.ok(head.includes("&quot;&amp;&#39;"));
    }
});

await test("metadata depends on the title rather than summaries or later body content", () => {
    const first = renderDocument("# Stable title\n\nA sentence about apples.\n");
    const second = renderDocument("# Stable title\n\nCompletely different body.\n\n## Other section\n");
    assert.deepEqual(metadata(first), metadata(second));
    assert.match(first, /A sentence about apples\./u);
    assert.match(second, /Completely different body\./u);
});

await test("default favicon data URIs contain the exact supplied SVG and ICO assets", () => {
    const html = renderDocument("# Icon defaults\n");
    const icons = [...headOf(html).matchAll(/<link\s[^>]*>/gu)]
        .map(([tag]) => tag)
        .filter((tag) => attribute(tag, "rel") === "icon");
    assert.equal(icons.length, 2);
    for (const [type, file] of [
        ["image/svg+xml", "favicon.svg"],
        ["image/vnd.microsoft.icon", "favicon.ico"],
    ]) {
        const icon = icons.find((tag) => attribute(tag, "type") === type);
        assert.ok(icon, `Missing ${String(type)} icon`);
        const href = attribute(icon, "href");
        assert.ok(href);
        assert.ok(href.startsWith(`data:${String(type)};base64,`));
        const bytes = Buffer.from(href.slice(href.indexOf(",") + 1), "base64");
        assert.deepEqual(bytes, readFileSync(new URL(`../assets/${String(file)}`, import.meta.url)));
    }
    const cspTag = [...headOf(html).matchAll(/<meta\s[^>]*>/gu)]
        .map(([tag]) => tag)
        .find((tag) => attribute(tag, "http-equiv") === "Content-Security-Policy");
    assert.ok(cspTag);
    const csp = attribute(cspTag, "content") ?? "";
    assert.match(csp, /(?:^|;)\s*img-src data:(?:;|$)/u);
    assert.match(csp, /(?:^|;)\s*default-src 'none'(?:;|$)/u);
    assert.match(csp, /(?:^|;)\s*connect-src 'none'(?:;|$)/u);
    assert.doesNotMatch(csp, /(?:https?:|\*)/u);
    assert.doesNotMatch(renderDocument("![remote](https://example.com/image.png)"), /<img\b/u);
});

await test("static theme-color metadata follows both existing CSS background palettes", () => {
    const html = renderDocument("# Theme defaults\n");
    const colors = metaTags(html, "theme-color");
    assert.equal(colors.length, 2);
    const css = /<style>([\s\S]*?)<\/style>/u.exec(headOf(html))?.[1] ?? "";
    const lightBackground = /:root\s*\{[^}]*--background:\s*(#[\da-f]+);/u.exec(css)?.[1];
    const darkBackground = /:root\[data-theme="dark"\]\s*\{[^}]*--background:\s*(#[\da-f]+);/u.exec(css)?.[1];
    assert.equal(lightBackground, "#f7f6f2");
    assert.equal(darkBackground, "#191814");
    for (const [scheme, background] of [
        ["light", lightBackground],
        ["dark", darkBackground],
    ]) {
        const tag = colors.find(
            (candidate) => attribute(candidate, "media") === `(prefers-color-scheme: ${String(scheme)})`
        );
        assert.ok(tag, `Missing ${String(scheme)} theme-color`);
        assert.equal(attribute(tag, "content"), background);
    }
});

await test("static HTML keeps native sections and body available while script controls are hidden and disabled", () => {
    const html = renderDocument(
        "Preamble stays readable.\n\n# Root\n\nBody stays readable.\n\n## Child\n\nChild body.\n"
    );
    for (const id of ["theme-toggle", "help-toggle", "toggle-all"]) {
        const button = [...html.matchAll(/<button\s[^>]*>/gu)]
            .map(([tag]) => tag)
            .find((tag) => attribute(tag, "id") === id);
        assert.ok(button, `Missing ${id}`);
        assert.match(button, /\shidden(?:\s|>)/u);
        assert.match(button, /\sdisabled(?:\s|>)/u);
    }
    assert.match(html, /\[hidden\]\s*\{\s*display:\s*none\s*!important/u);
    const sections = [...html.matchAll(/<details\s[^>]*>/gu)].map(([tag]) => tag);
    assert.equal(sections.length, 2);
    assert.match(sections[0] ?? "", /\sopen(?:\s|>)/u);
    assert.doesNotMatch(sections[1] ?? "", /\sopen(?:\s|>)/u);
    assert.equal([...html.matchAll(/<summary\s/gu)].length, 2);
    assert.match(html, /<p[^>]*>Preamble stays readable\.<\/p>/u);
    assert.match(html, /<p[^>]*>Body stays readable\.<\/p>/u);
    assert.match(html, /<p[^>]*>Child body\.<\/p>/u);
});

await test("standalone bundled CLI generates defaults and --check detects metadata or icon drift without writes", (context) => {
    const directory = mkdtempSync(join(tmpdir(), "markdown-tree-view-page-defaults-"));
    context.after(() => {
        rmSync(directory, { recursive: true, force: true });
    });
    const cli = join(directory, "markdown-tree-view.mjs");
    copyFileSync(new URL("../scripts/markdown-tree-view.mjs", import.meta.url), cli);
    const input = join(directory, "input.md");
    const output = join(directory, "output.html");
    const markdown = "# Standalone title\n\nOffline body.\n";
    writeFileSync(input, markdown);
    const run = (destination: string, check = false) =>
        spawnSync(process.execPath, [cli, "--input", input, "--output", destination, ...(check ? ["--check"] : [])], {
            cwd: directory,
            encoding: "utf8",
        });
    const generated = run(output);
    assert.equal(generated.status, 0, generated.stderr);
    const expected = readFileSync(output, "utf8");
    assert.equal(expected, renderDocument(markdown, { sourceName: "input.md" }));
    const checked = run(output, true);
    assert.equal(checked.status, 0, checked.stderr);

    const tagsToChange = [
        /<title>[^<]*<\/title>/u.exec(expected)?.[0],
        ...metaTags(expected, "description"),
        ...metaTags(expected, "theme-color"),
        ...[...headOf(expected).matchAll(/<link\s[^>]*>/gu)]
            .map(([tag]) => tag)
            .filter((tag) => attribute(tag, "rel") === "icon"),
    ];
    assert.equal(tagsToChange.length, 6);
    for (const tag of tagsToChange) {
        assert.ok(tag);
        const modified = expected.replace(tag, "<!-- removed a required page default -->");
        assert.notEqual(modified, expected);
        writeFileSync(output, modified);
        const past = new Date("2000-01-01T00:00:00Z");
        utimesSync(output, past, past);
        const before = statSync(output).mtimeMs;
        const entries = readdirSync(directory);
        const result = run(output, true);
        assert.equal(result.status, 1, `Expected mismatch for ${tag.slice(0, 80)}: ${result.stderr}`);
        assert.match(result.stderr, /Output is missing or differs/u);
        assert.equal(readFileSync(output, "utf8"), modified);
        assert.equal(statSync(output).mtimeMs, before);
        assert.deepEqual(readdirSync(directory), entries);
        assert.equal(readFileSync(input, "utf8"), markdown);
    }

    const missingDirectory = join(directory, "must-not-be-created");
    const missing = run(join(missingDirectory, "output.html"), true);
    assert.equal(missing.status, 1, missing.stderr);
    assert.equal(existsSync(missingDirectory), false);
});
