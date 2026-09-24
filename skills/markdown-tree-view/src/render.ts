import { createHash } from "node:crypto";
import type { Token } from "markdown-it";
import packageJson from "../package.json" with { type: "json" };
import { css, script, license, faviconSvg, faviconIco } from "./assets.ts";
import { escapeHtml, parseDocument } from "./markdown.ts";
import type { HeadingSection } from "./markdown.ts";

export interface RenderOptions {
    sourceName?: string;
}

export function renderDocument(markdown: string, { sourceName = "document.md" }: RenderOptions = {}): string {
    const { md, env, root, nodes } = parseDocument(markdown);
    const documentTitle =
        nodes
            .find((node) => node.level === 1 && node.title.trim())
            ?.title.replace(/\s+/gu, " ")
            .trim() ?? sourceName;
    const description = `《${documentTitle}》的 Markdown 折叠树阅读视图。`;
    const renderBody = (tokens: Token[], className: string): string =>
        tokens.length
            ? `<div class="markdown ${className}" data-source-line="${String((tokens.find((token) => token.map)?.map?.[0] ?? 0) + 1)}">${md.renderer.render(tokens, md.options, env)}</div>`
            : "";
    const renderNode = (
        node: HeadingSection,
        isRoot = false
    ): string => `<details class="tree-node" id="${node.id}" data-source-line="${String(node.line)}" data-source-end="${String(node.endLine)}" data-heading-level="${String(node.level)}"${isRoot ? " open" : ""}>
<summary class="tree-row" tabindex="0"><span class="chevron" aria-hidden="true"></span><span class="heading-label" id="${escapeHtml(node.alias)}">${node.titleHtml || '<span class="empty-heading">（空标题）</span>'}</span><span class="source-location" title="源文件第 ${String(node.line)} 行">L${String(node.line)}</span></summary>
<div class="children">${renderBody(node.tokens, "section-body")}${node.children.map((child) => renderNode(child)).join("\n")}</div>
</details>`;
    const allExpanded = nodes.length > 0 && nodes.length === root.children.length;
    const isEmpty = root.tokens.length === 0 && root.children.length === 0;
    const lineCount = markdown.split(/\r\n|\r|\n/u).length;
    const sourceHash = createHash("sha256").update(markdown).digest("hex");
    const scriptHash = createHash("sha256").update(script).digest("base64");
    return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<!--
Markdown Tree View reader code (HTML template, CSS and JavaScript):

${license}

This license applies only to the reader code supplied by Markdown Tree View.
The input document retains its original rights and license.
-->
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'sha256-${scriptHash}'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; font-src 'none'; base-uri 'none'; form-action 'none'">
<meta name="generator" content="Markdown Tree View ${packageJson.version}">
<meta name="source-sha256" content="${sourceHash}">
<title>${escapeHtml(documentTitle)} · Markdown Tree View</title>
<meta name="description" content="${escapeHtml(description)}">
<meta name="theme-color" content="#f7f6f2" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#191814" media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/vnd.microsoft.icon" href="${faviconIco}">
<link rel="icon" type="image/svg+xml" sizes="any" href="${faviconSvg}">
<style>${css}</style>
</head>
<body>
<main>
<header class="masthead"><div class="brand"><svg class="brand-mark" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></svg><span>Markdown Tree View</span></div><button type="button" id="theme-toggle" class="theme-toggle" aria-label="切换配色" title="切换配色" hidden disabled><span class="theme-glyph" aria-hidden="true"></span></button></header>
<article class="reader">
<header class="document-header">
<div class="header-bar"><div class="document-info"><h1 title="${escapeHtml(sourceName)}">${escapeHtml(sourceName)}</h1><p class="document-meta">${String(nodes.length)} 个标题 · ${String(lineCount)} 行</p></div><div class="document-actions"><button type="button" id="toggle-all" aria-controls="document-tree" aria-expanded="${String(allExpanded)}" hidden disabled>${allExpanded ? "全部折叠" : "全部展开"}</button><button type="button" id="help-toggle" class="help-toggle" aria-controls="reading-help" aria-expanded="false" hidden disabled>操作帮助</button></div></div>
</header>
<section id="reading-help" class="help-panel" aria-label="操作帮助" hidden>
<div class="help-heading"><h2>操作帮助</h2><button type="button" class="help-close" aria-label="关闭帮助">×</button></div>
<div class="help-content" role="region" aria-label="操作说明" tabindex="0">
<div class="help-group"><h3>基础操作</h3><dl class="help-basics"><div><dt>单个章节</dt><dd>点击标题展开或折叠</dd></div><div><dt>整篇文档</dt><dd>使用顶部 <strong class="control-label">全部展开</strong> / <strong class="control-label">全部折叠</strong></dd></div><div><dt>收起帮助</dt><dd>点击右上角的 <strong class="control-label">关闭按钮</strong> 或浮层外侧</dd></div></dl></div>
<div class="help-group"><h3>键盘操作</h3><p class="help-note">标题导航需先按 <kbd>Tab</kbd> 聚焦标题</p><dl class="shortcut-list"><div><dt>上一个 / 下一个标题</dt><dd><kbd>↑</kbd> <kbd>↓</kbd></dd></div><div><dt>展开章节 / 进入下级</dt><dd><kbd>→</kbd></dd></div><div><dt>折叠章节 / 返回上级</dt><dd><kbd>←</kbd></dd></div><div><dt>首个 / 末个可见标题</dt><dd><kbd>Home</kbd> <kbd>End</kbd></dd></div><div><dt>展开 / 折叠当前章节</dt><dd><kbd>Enter</kbd> <kbd>Space</kbd></dd></div><div><dt>关闭帮助</dt><dd><kbd>Esc</kbd></dd></div></dl></div>
<div class="help-group"><h3>源文件定位</h3><div class="source-example"><code>L24</code><span>对应 Markdown 源文件第 <strong>24</strong> 行</span></div></div>
</div>
</section>
<section id="document-tree" class="tree" aria-label="Markdown 文档树" tabindex="0">
${renderBody(root.tokens, "preamble")}${root.children.map((node) => renderNode(node, true)).join("\n")}${isEmpty ? '<p class="empty-document">文档为空。</p>' : ""}
</section>
</article>
</main>
<script>${script}</script>
</body>
</html>
`;
}
