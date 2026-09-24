# 开发

本目录是维护工程；完整安装产物位于 `dist/markdown-tree-view/`，安装步骤见[安装说明](docs/installation.md)。Node.js 开发基线见 [.node-version](.node-version)。

## 检查与构建

在本目录执行：

```sh
npm ci
npm run verify
```

`npm run check` 执行格式、类型感知 lint 和类型检查；`npm run format` 格式化维护代码与配置。`npm run verify` 完成检查、构建及构建产物一致性校验。源码使用严格 TypeScript，Node.js 与浏览器分别检查类型。

类型检查使用 TypeScript 7 的 `tsc`；类型感知 ESLint 使用官方 TypeScript 6 API 兼容包，两者通过 [Microsoft 推荐的 npm alias 方案](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6-0)并行安装。

单独构建或检查产物：

```sh
npm run build
npm run build -- --check
```

构建将 [assets/](assets/) 中的图标与浏览器资源内嵌到 CLI，生成第三方许可声明，并复制 [build.ts](build.ts) 明确列出的使用文件到交付目录。`--check` 比较全部应交付文件的内容，检查缺失和额外条目，不写文件或创建目录。构建发现额外条目或非普通文件时也会停止，保留现场；先检查来源，再决定是否移走这些条目，构建不会自动清理。

修改源码、资源、Skill 指令或交付文档后重新构建。`dist/` 由 Git 忽略，源码目录不保留旧的 `scripts/` bundle 或生成的第三方声明。新增必要使用文件时同步更新构建文件清单；开发说明、源码和开发依赖不进入安装目录。

## 源码入口

全部运行源码位于 [src/](src/)，CLI 入口为 [src/cli.ts](src/cli.ts)，构建入口为 [build.ts](build.ts)，Skill 指令维护于 [SKILL.md](SKILL.md)。安装开发依赖后可直接调试：

```sh
node src/cli.ts --input examples/guide.md --output work/guide.html
```

浏览器 TypeScript 会编译为内嵌 JavaScript。已构建的 CLI 无需 TypeScript 工具链；安装后的核对方式见[安装说明](docs/installation.md#核对安装)。
