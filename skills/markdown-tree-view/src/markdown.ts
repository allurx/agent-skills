import MarkdownIt from "markdown-it";
import type { MarkdownIt as MarkdownParser, StateCore, Token } from "markdown-it";

interface DocumentSection {
    children: HeadingSection[];
    tokens: Token[];
}

export interface HeadingSection extends DocumentSection {
    id: string;
    alias: string;
    anchor?: string;
    level: number;
    line: number;
    endLine: number;
    title: string;
    titleHtml: string;
}

interface ParsedDocument {
    md: MarkdownParser;
    env: Record<string, unknown>;
    root: DocumentSection;
    nodes: HeadingSection[];
}

const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};

// Preserve previously generated aliases while freeing these names for heading links.
const legacyControlIds = new Set(["document-tree", "toggle-all", "theme-toggle", "help-toggle", "reading-help"]);

export function escapeHtml(value: unknown): string {
    return String(value).replace(/[&<>"']/gu, (char) => htmlEntities[char] ?? char);
}

function plainText(tokens: Token[] | null = []): string {
    return (tokens ?? [])
        .map((token) => {
            if (token.type === "image") return plainText(token.children);
            if (token.type === "softbreak" || token.type === "hardbreak") return " ";
            return token.nesting === 0 ? token.content : "";
        })
        .join("");
}

function safeLink(href: string): boolean {
    return href.startsWith("#") || ["http:", "https:", "mailto:"].includes(URL.parse(href)?.protocol ?? "");
}

function extractTaskMarker(state: StateCore, index: number, token: Token): void {
    const listItem = state.tokens[index - 2];
    if (
        token.type !== "inline" ||
        state.tokens[index - 1]?.type !== "paragraph_open" ||
        listItem?.type !== "list_item_open"
    )
        return;
    // Extract the literal marker before inline parsing can resolve [x] as a reference link.
    const task = /^\[([ xX])\](?=\s|$)/u.exec(token.content);
    if (!task) return;
    token.content = token.content.slice(task[0].length);
    token.meta = { treeTaskChecked: task[1]?.toLowerCase() === "x" };
}

function transformLinks(tokens: Token[]): void {
    const stack: { allowed: boolean; href: string }[] = [];
    for (const token of tokens) {
        if (token.type === "link_open") {
            const href = token.attrGet("href");
            if (typeof href !== "string") throw new Error("Markdown link has no string destination.");
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

function rendererToken(tokens: Token[], index: number): Token {
    const token = tokens[index];
    if (!token) throw new Error(`Markdown renderer token is missing at index ${String(index)}.`);
    return token;
}

function parser(): MarkdownParser {
    const md = new MarkdownIt({ html: false, linkify: false, typographer: false });
    md.renderer.rules["image"] = (tokens, index) => {
        const token = rendererToken(tokens, index);
        const title = token.attrGet("title");
        return `<span class="image-placeholder resource-placeholder">[图片：${escapeHtml(plainText(token.children) || "无替代文字")} — ${escapeHtml(token.attrGet("src"))}${title ? ` · ${escapeHtml(title)}` : ""}]</span>`;
    };
    md.renderer.rules["blocked_link_close"] = (tokens, index) =>
        ` <span class="resource-address">(${escapeHtml(rendererToken(tokens, index).content)})</span></span>`;
    md.renderer.rules["task_checkbox"] = (tokens, index) => {
        const checked = rendererToken(tokens, index).meta?.["checked"] === true;
        return `<input type="checkbox" disabled${checked ? " checked" : ""} aria-label="${checked ? "已完成" : "未完成"}"> `;
    };
    md.core.ruler.before("inline", "tree-task-markers", (state) => {
        for (const [index, token] of state.tokens.entries()) extractTaskMarker(state, index, token);
    });
    md.core.ruler.after("inline", "tree-safety-and-tasks", (state) => {
        for (const [index, token] of state.tokens.entries()) {
            if (token.map && token.type !== "inline") {
                token.attrSet("data-source-line", String(token.map[0] + 1));
                token.attrSet("data-source-end", String(token.map[1]));
            }
            if (!token.children) continue;
            const checked = token.meta?.["treeTaskChecked"];
            if (typeof checked === "boolean") {
                // Preserve soft/hard breaks during parsing, then remove the marker's text separator.
                const first = token.children[0];
                if (first?.type === "text") first.content = first.content.replace(/^\s/u, "");
                const checkbox = new state.Token("task_checkbox", "input", 0);
                checkbox.meta = { checked };
                token.children.unshift(checkbox);
                state.tokens[index - 2]?.attrJoin("class", "task-item");
            }
            transformLinks(token.children);
        }
    });
    return md;
}

// Split only at document-level heading tokens: nested Markdown remains intact.
export function parseDocument(markdown: string): ParsedDocument {
    const md = parser();
    const env: Record<string, unknown> = {};
    // A transport BOM must not turn the first heading into a paragraph.
    const tokens = md.parse(markdown.replace(/^\uFEFF/u, ""), env);
    const root: DocumentSection = { children: [], tokens: [] };
    const stack: HeadingSection[] = [];
    const nodes: HeadingSection[] = [];
    const usedIds = new Set(legacyControlIds);
    const availableControlAnchors = new Set(legacyControlIds);
    for (let i = 0; i < tokens.length; i++) {
        const token = rendererToken(tokens, i);
        if (token.type !== "heading_open" || token.level !== 0) {
            (stack.at(-1) ?? root).tokens.push(token);
            continue;
        }
        const level = Number(token.tag.slice(1));
        while (stack.length) {
            const parent = stack.at(-1);
            if (!parent || parent.level < level) break;
            stack.pop();
        }
        const inline = tokens[i + 1];
        const close = tokens[i + 2];
        if (!token.map || inline?.type !== "inline" || !inline.children || close?.type !== "heading_close") {
            throw new Error(`Markdown heading tokens are incomplete at index ${String(i)}.`);
        }
        i += 2;
        const node: HeadingSection = {
            id: `section-${String(nodes.length + 1)}`,
            alias: "",
            level,
            line: token.map[0] + 1,
            endLine: token.map[1],
            title: plainText(inline.children),
            titleHtml: md.renderer.renderInline(inline.children, md.options, env),
            tokens: [],
            children: [],
        };
        (stack.at(-1) ?? root).children.push(node);
        stack.push(node);
        nodes.push(node);
        usedIds.add(node.id);
    }
    const nextSuffix = new Map<string, number>();
    for (const node of nodes) {
        const base =
            node.title
                .toLowerCase()
                .replace(/[^\p{L}\p{N}\p{M}_\-\s]/gu, "")
                .trim()
                .replace(/\s+/gu, "-") || "heading";
        let alias = base;
        let suffix = nextSuffix.get(base) ?? 1;
        while (usedIds.has(alias)) alias = `${base}-${String(suffix++)}`;
        nextSuffix.set(base, suffix);
        usedIds.add(alias);
        node.alias = alias;
        if (availableControlAnchors.delete(base)) node.anchor = base;
    }
    return { md, env, root, nodes };
}
