# Markdown 折叠树

将单个 UTF-8 Markdown 文件转换为独立的离线 HTML 折叠树，保留正文、顺序和真实标题层级，适用于 `AGENTS.md`、`CLAUDE.md`、README 和规范文档。可通过 Skill 或 Node.js CLI 使用，生成的 HTML 内嵌样式、脚本和默认图标。

## 快速上手

需要 Node.js 24 或更新版本。`scripts/` 存放供 Skill 执行的构建成品，仅包含一个已内嵌运行依赖、页面资源和许可证的 `markdown-tree-view.mjs`。可以单独复制这个文件使用，无需源码或 npm 安装。在本 Skill 根目录执行：

```sh
node scripts/markdown-tree-view.mjs --input README.md --output work/readme.html
```

使用现代浏览器打开 `work/readme.html`，无需启动服务器。点击标题展开、折叠章节。JavaScript 初始化成功后，顶部操作按钮和键盘导航可用；标题获得焦点后，可用方向键导航、`Home` / `End` 跳转、`Enter` / `Space` 切换展开状态。JavaScript 不可用或初始化失败时，正文和原生章节折叠仍可使用，依赖脚本的操作按钮保持隐藏、禁用。

文档树独立滚动，品牌栏、文件名与操作区在滚动时保持可见；点击 **操作帮助** 可查看键盘和源行号说明。页面默认跟随系统配色，可通过配色按钮切换明暗模式，刷新后恢复跟随系统。浏览器支持时，`theme-color` 随系统配色和本页主题选择更新；未启用脚本时仍提供匹配系统配色的静态元信息。

标签页标题取第一个非空文档级 H1 的纯文本，移除 Markdown 样式并折叠空白；没有可用 H1 时回退源文件名，统一附加 ` · Markdown Tree View`。页面 `description` 只依据该文档标题生成简短的阅读视图说明，不总结正文。

检查已有 HTML 是否与当前输入和转换器一致，或查看参数说明：

```sh
node scripts/markdown-tree-view.mjs -i README.md -o work/readme.html --check
node scripts/markdown-tree-view.mjs --help
```

### 注意事项

- 输入与输出参数必填，可简写为 `-i` / `-o`；路径含空格时需加引号。输入必须是有效 UTF-8，且不能与输出指向同一文件。
- 生成模式会创建输出目录并覆盖指定输出文件；`--check` 比较完整 HTML，包括默认图标和页面元信息，只比较、不写文件，需要更新时去掉该参数重新生成。
- CLI 和 Skill 构建命令的退出码：`0` 表示成功或一致，`1` 表示检查时缺失或不一致，`2` 表示参数或运行错误。

## Skill 使用

将仓库中的 `skills/markdown-tree-view/` 整个目录放入 Agent 的 Skill 目录，不能只复制 `SKILL.md`。调用示例：

```text
使用 $markdown-tree-view，将 ./AGENTS.md 转换为 ./work/agents-tree.html。
```

## 支持范围

支持常见 Markdown 标题、段落、列表、引用、代码块、表格和任务列表，参见[示例文档](examples/guide.md)。支持重复标题、跳级标题和无标题文档；跳级标题归入最近的较低级标题，不补造层级。只有文档级标题生成树节点，列表和引用内的标题保留在正文中。

### 注意事项

- 原始 HTML 按文字显示。图片只显示替代文字和地址，不加载资源；相对文件链接和其他不支持的地址显示为文字。
- 可点击 `http:`、`https:`、`mailto:` 和页内片段链接；外部链接需要相应网络或应用。
- 脚注、数学公式、Mermaid、YAML front matter 没有专门的渲染支持，按普通 Markdown 或代码文字显示。
- 折叠章节的内容仍包含在 HTML 中，会随文件一起分享。
- 默认 favicon 通过 data URI 内嵌，优先使用 SVG，并提供 ICO 兼容回退；发布时无需额外图标文件或修改 HTML、CSP。不支持 data URI favicon 的旧浏览器可能不显示图标；不支持 `theme-color` 的浏览器会忽略它，不影响阅读。

## 开发

Node.js 开发基线见 [.node-version](.node-version)。在本 Skill 根目录执行：

```sh
npm ci
npm run verify
```

源码使用严格 TypeScript，Node.js 与浏览器分别检查类型。`npm run check` 执行格式、类型感知 lint 和类型检查；`npm run format` 格式化维护代码与配置。`npm run verify` 完成检查、构建、测试及构建产物一致性校验。

类型检查使用 TypeScript 7 的 `tsc`；类型感知 ESLint 使用官方 TypeScript 6 API 兼容包，两者通过 [Microsoft 推荐的 npm alias 方案](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6-0)并行安装。

`npm run build` 生成 `scripts/markdown-tree-view.mjs`，将 [assets/](assets/) 中的默认图标打包进独立 CLI，同时同步仓库中的 `THIRD-PARTY-NOTICES.txt`；追加 `-- --check` 只检查它们与当前源码和资源是否一致，不写文件。`scripts/` 仅放构建成品，不混入构建脚本或其他文件；构建发现额外内容时会报错，不自动删除。修改源码或资源后同步更新生成物，保持完整 Skill 目录可直接安装使用。

全部运行源码位于 [src/](src/)，CLI 入口为 [src/cli.ts](src/cli.ts)，构建入口为根目录的 [build.ts](build.ts)，Skill 指令维护于 [SKILL.md](SKILL.md)。安装开发依赖后，可用 `node src/cli.ts` 搭配同一组 CLI 参数调试。浏览器 TypeScript 会编译为内嵌 JavaScript，安装使用仍仅需 Node.js，无需 TypeScript 工具链。

## 许可证

本工具的自有代码、Skill 指令、文档和示例采用 [MIT 许可证](LICENSE.txt)。第三方依赖保留其原有许可，声明见 [THIRD-PARTY-NOTICES.txt](THIRD-PARTY-NOTICES.txt)。

构建的独立 CLI 脚本自动携带本工具许可和第三方声明，生成的 HTML 自动携带本工具许可。HTML 中的许可仅覆盖页面模板、样式和脚本；输入 Markdown 及其转换后的文档内容仍按原有授权处理，不会自动采用 MIT。
