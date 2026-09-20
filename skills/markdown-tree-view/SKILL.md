---
name: markdown-tree-view
description: 将单个 Markdown 文件转换为保留内容、顺序和标题层级的离线 HTML 折叠树，或检查已有 HTML 是否与输入同步。适用于 AGENTS.md、CLAUDE.md、README 和规范文档的可折叠阅读视图；不用于改写内容、合并文档或分析指令优先级。
---

# Markdown Tree View

使用本 Skill 自带的 `scripts/markdown-tree-view.mjs` 执行转换。它与项目 CLI 来自同一份实现，包含解析器和页面资源；运行仅需 Node.js 24 或更新版本，不依赖源码 checkout 或 npm 安装。不要用 AI 重写、摘要或重新分类输入内容。

## 转换与检查

按用户指定的路径选择单个 UTF-8 Markdown 输入和 HTML 输出。未指定输出时，优先在输入同目录生成 `<文件名>.tree.html`；若该目标已存在且用户未要求覆盖，选择未占用的名称。将以下占位路径替换为实际绝对路径，Skill 目录以当前加载的 `SKILL.md` 所在目录为准：

```sh
node "<skill-directory>/scripts/markdown-tree-view.mjs" --input "<input.md>" --output "<output.html>"
node "<skill-directory>/scripts/markdown-tree-view.mjs" --input "<input.md>" --output "<output.html>" --check
```

`-i` / `-o` 是输入输出参数的简写；`--help` 查看用法。生成模式创建输出目录并替换指定输出；输入输出不能为同一文件。`--check` 只比较已有结果，不写文件或创建目录；用户只要求检查时不要自动重新生成。

退出码：`0` 为成功或一致，`1` 为检查时输出缺失或不一致，`2` 为参数、编码、读取、转换或写入失败。根据命令的实际诊断处理，不把检查失配表述为转换成功。若随附脚本缺失，说明安装不完整，应复制仓库中的完整 `skills/markdown-tree-view/` 目录，不能只安装指令文件。维护源码和构建命令见本目录的 [README.md](README.md#开发)。

生成后执行 `--check`，确认交付文件与当前输入一致。可用浏览器时，通过 `file://` 打开输出，抽查标题、正文和折叠操作；无浏览器能力时说明未做交互检查。交付 HTML 的可点击文件链接，并说明实际检查结果及与该输入有关的渲染限制。

## 内容边界

文档级标题按真实 Markdown 级别建树，不要求编号。重复标题和跳级标题允许存在；引用或列表内部的标题仍在相应正文中。页面默认展开根节点、折叠下级章节，并显示源文件名和源行定位；源文件 SHA-256 保留在 HTML 元数据中。需要核对原始语法时请查看输入 Markdown 文件。

原始 HTML 按文字呈现。图片只显示替代文字和地址，不加载资源；相对文件链接显示目的地址。支持点击 `http:`、`https:`、`mailto:` 和页内片段链接，外部链接需要相应网络或应用。脚注、数学公式、Mermaid 等没有专门的渲染扩展，按普通 Markdown 或代码文字显示。HTML 包含转换后的文档内容，折叠章节中的内容也会随文件一起分享。
