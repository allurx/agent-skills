# Markdown Tree View

将单个 UTF-8 Markdown 文件转换为独立的离线 HTML 折叠树，保留正文、顺序和真实标题层级，适用于 `AGENTS.md`、`CLAUDE.md`、README 和规范文档。可通过 Skill 或 Node.js CLI 使用，生成的 HTML 内嵌样式与脚本。

## 快速上手

需要 Node.js 24 或更新版本。随附脚本已包含运行依赖，无需 npm 安装。在本 Skill 根目录执行：

```sh
node scripts/markdown-tree-view.mjs --input README.md --output work/readme.html
```

使用启用 JavaScript 的现代浏览器打开 `work/readme.html`，无需启动服务器。点击标题或顶部按钮展开、折叠章节；标题获得焦点后，可用方向键导航、`Home` / `End` 跳转、`Enter` / `Space` 切换展开状态。

文档树独立滚动，品牌栏、文件名与操作区在滚动时保持可见；点击 **操作帮助** 可查看键盘和源行号说明。页面默认跟随系统配色，可通过配色按钮切换明暗模式，刷新后恢复跟随系统。

检查已有 HTML 是否与当前输入和转换器一致，或查看参数说明：

```sh
node scripts/markdown-tree-view.mjs -i README.md -o work/readme.html --check
node scripts/markdown-tree-view.mjs --help
```

### 注意事项

- 输入与输出参数必填，可简写为 `-i` / `-o`；路径含空格时需加引号。输入必须是有效 UTF-8，且不能与输出指向同一文件。
- 生成模式会创建输出目录并覆盖指定输出文件；`--check` 只比较、不写文件，需要更新时去掉该参数重新生成。
- CLI 和 Skill 构建命令的退出码：`0` 表示成功或一致，`1` 表示检查时缺失或不一致，`2` 表示参数或运行错误。

## Skill 使用

将仓库中的 `skills/markdown-tree-view/` 整个目录放入 Agent 的 Skill 目录，不能只复制 `SKILL.md`。调用示例：

```text
使用 $markdown-tree-view，将 ./AGENTS.md 转换为 ./work/agents-tree.html。
```

第三方依赖的许可证见 [THIRD-PARTY-NOTICES.txt](THIRD-PARTY-NOTICES.txt)。

## 支持范围

支持常见 Markdown 标题、段落、列表、引用、代码块、表格和任务列表，参见[示例文档](examples/guide.md)。支持重复标题、跳级标题和无标题文档；跳级标题归入最近的较低级标题，不补造层级。只有文档级标题生成树节点，列表和引用内的标题保留在正文中。

### 注意事项

- 原始 HTML 按文字显示。图片只显示替代文字和地址，不加载资源；相对文件链接和其他不支持的地址显示为文字。
- 可点击 `http:`、`https:`、`mailto:` 和页内片段链接；外部链接需要相应网络或应用。
- 脚注、数学公式、Mermaid、YAML front matter 没有专门的渲染支持，按普通 Markdown 或代码文字显示。
- 折叠章节的内容仍包含在 HTML 中，会随文件一起分享。

## 开发

Node.js 开发基线见 [.node-version](.node-version)。在本 Skill 根目录执行：

```sh
npm ci
npm run build:skill
npm run build:skill -- --check
```

构建更新 `scripts/markdown-tree-view.mjs` 和 `THIRD-PARTY-NOTICES.txt`；`--check` 只检查它们与当前源码是否一致，不写文件。修改源码后应同步更新这两个生成物，保持完整目录可直接安装使用。

CLI 入口为 [bin/markdown-tree-view.mjs](bin/markdown-tree-view.mjs)，实现位于 [src/](src/)，构建入口为 [scripts/build-skill.mjs](scripts/build-skill.mjs)，Skill 指令维护于 [SKILL.md](SKILL.md)。
