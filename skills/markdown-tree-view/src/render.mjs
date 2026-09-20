import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import MarkdownIt from "markdown-it";
import packageJson from "../package.json" with { type: "json" };

const escapeHtml = (value) => String(value).replace(/[&<>"']/gu, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
})[char]);

const css = typeof BUNDLED_CSS === "string" ? BUNDLED_CSS : readFileSync(new URL("./view.css", import.meta.url), "utf8");
const script = typeof BUNDLED_JS === "string" ? BUNDLED_JS : readFileSync(new URL("./view.js", import.meta.url), "utf8");

function plainText(tokens = []) {
  return tokens.map((token) => {
    if (token.type === "image") return plainText(token.children);
    if (token.type === "softbreak" || token.type === "hardbreak") return " ";
    return token.nesting === 0 ? token.content : "";
  }).join("");
}

function safeLink(href) {
  return href.startsWith("#")
    || ["http:", "https:", "mailto:"].includes(URL.parse(href)?.protocol);
}

function transformTaskItem(state, index) {
  const token = state.tokens[index];
  const first = token.children[0];
  const task = first?.type === "text" && first.content.match(/^\[([ xX])\](?:\s|$)/u);
  if (!task || state.tokens[index - 1]?.type !== "paragraph_open" || state.tokens[index - 2]?.type !== "list_item_open") return;
  first.content = first.content.slice(task[0].length);
  const checkbox = new state.Token("task_checkbox", "input", 0);
  checkbox.meta = { checked: task[1].toLowerCase() === "x" };
  token.children.unshift(checkbox);
  state.tokens[index - 2].attrJoin("class", "task-item");
}

function transformLinks(tokens) {
  const stack = [];
  for (const token of tokens) {
    if (token.type === "link_open") {
      const href = token.attrGet("href");
      const allowed = safeLink(href);
      stack.push({ allowed, href });
      if (allowed && !href.startsWith("#")) {
        token.attrSet("rel", "noopener noreferrer");
        token.attrSet("target", "_blank");
      } else if (!allowed) {
        token.tag = "span";
        token.attrs = [["class", "link-placeholder resource-placeholder"]];
      }
    } else if (token.type === "link_close") {
      const link = stack.pop();
      if (link && !link.allowed) {
        token.type = "blocked_link_close";
        token.content = link.href;
      }
    }
  }
}

function parser() {
  const md = new MarkdownIt({ html: false, linkify: false, typographer: false });
  md.renderer.rules.image = (tokens, index) => {
    const token = tokens[index];
    const title = token.attrGet("title");
    return `<span class="image-placeholder resource-placeholder">[图片：${escapeHtml(plainText(token.children) || "无替代文字")} — ${escapeHtml(token.attrGet("src"))}${title ? ` · ${escapeHtml(title)}` : ""}]</span>`;
  };
  md.renderer.rules.blocked_link_close = (tokens, index) => ` <span class="resource-address">(${escapeHtml(tokens[index].content)})</span></span>`;
  md.renderer.rules.task_checkbox = (tokens, index) => `<input type="checkbox" disabled${tokens[index].meta.checked ? " checked" : ""} aria-label="${tokens[index].meta.checked ? "已完成" : "未完成"}"> `;
  md.core.ruler.after("inline", "tree-safety-and-tasks", (state) => {
    for (let i = 0; i < state.tokens.length; i++) {
      const token = state.tokens[i];
      if (token.map && token.type !== "inline") {
        token.attrSet("data-source-line", String(token.map[0] + 1));
        token.attrSet("data-source-end", String(token.map[1]));
      }
      if (!token.children) continue;
      transformTaskItem(state, i);
      transformLinks(token.children);
    }
  });
  return md;
}

// Split only at document-level heading tokens: nested Markdown remains intact.
function parseDocument(markdown) {
  const md = parser();
  const env = {};
  // A transport BOM must not turn the first heading into a paragraph.
  const tokens = md.parse(markdown.replace(/^\uFEFF/u, ""), env);
  const root = { level: 0, children: [], tokens: [] };
  const stack = [root];
  const nodes = [];
  const usedIds = new Set(["document-tree", "toggle-all"]);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type !== "heading_open" || token.level !== 0) {
      stack.at(-1).tokens.push(token);
      continue;
    }
    const level = Number(token.tag.slice(1));
    while (stack.at(-1).level >= level) stack.pop();
    const inline = tokens[++i];
    i++; // The matching heading_close token.
    const node = {
      id: `section-${nodes.length + 1}`,
      level,
      line: token.map[0] + 1,
      endLine: token.map[1],
      title: plainText(inline.children),
      titleHtml: md.renderer.renderInline(inline.children, md.options, env),
      tokens: [],
      children: [],
    };
    stack.at(-1).children.push(node);
    stack.push(node);
    nodes.push(node);
    usedIds.add(node.id);
  }
  for (const node of nodes) {
    const base = node.title.toLowerCase().replace(/[^\p{L}\p{N}\p{M}_\-\s]/gu, "").trim().replace(/\s+/gu, "-") || "heading";
    let alias = base;
    for (let suffix = 1; usedIds.has(alias); suffix++) alias = `${base}-${suffix}`;
    usedIds.add(alias);
    node.alias = alias;
  }
  return { md, env, root, nodes };
}

export function renderDocument(markdown, { sourceName = "document.md" } = {}) {
  const { md, env, root, nodes } = parseDocument(markdown);
  const renderBody = (tokens, className) => tokens.length
    ? `<div class="markdown ${className}" data-source-line="${tokens.find((token) => token.map)?.map[0] + 1 || 1}">${md.renderer.render(tokens, md.options, env)}</div>`
    : "";
  const renderNode = (node, isRoot = false) => `<details class="tree-node" id="${node.id}" data-source-line="${node.line}" data-source-end="${node.endLine}" data-heading-level="${node.level}"${isRoot ? " open" : ""}>
<summary class="tree-row" tabindex="0"><span class="chevron" aria-hidden="true"></span><span class="heading-label" id="${escapeHtml(node.alias)}">${node.titleHtml || "<span class=\"empty-heading\">（空标题）</span>"}</span><span class="source-location" title="源文件第 ${node.line} 行">L${node.line}</span></summary>
<div class="children">${renderBody(node.tokens, "section-body")}${node.children.map((child) => renderNode(child)).join("\n")}</div>
</details>`;
  const allExpanded = nodes.length > 0 && nodes.length === root.children.length;
  const isEmpty = root.tokens.length === 0 && root.children.length === 0;
  const sourceHash = createHash("sha256").update(markdown).digest("hex");
  const scriptHash = createHash("sha256").update(script).digest("base64");
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'sha256-${scriptHash}'; style-src 'unsafe-inline'; img-src 'none'; connect-src 'none'; font-src 'none'; base-uri 'none'; form-action 'none'">
<meta name="generator" content="Markdown Tree View ${packageJson.version}">
<meta name="source-sha256" content="${sourceHash}">
<title>${escapeHtml(sourceName)} · Markdown Tree View</title>
<style>${css}</style>
</head>
<body>
<main>
<header><div><h1>${escapeHtml(sourceName)}</h1><p class="meta">Markdown Tree View · ${nodes.length} 个标题 · ${markdown.split(/\r\n|\r|\n/u).length} 行</p></div><button type="button" id="toggle-all" aria-controls="document-tree" aria-expanded="${allExpanded}"${nodes.length ? "" : " disabled"}>${allExpanded ? "全部折叠" : "全部展开"}</button></header>
<section id="document-tree" class="tree" aria-label="Markdown 文档树">
${renderBody(root.tokens, "preamble")}${root.children.map((node) => renderNode(node, true)).join("\n")}${isEmpty ? "<p class=\"empty-document\">文档为空。</p>" : ""}
</section>
</main>
<script>${script}</script>
</body>
</html>
`;
}
