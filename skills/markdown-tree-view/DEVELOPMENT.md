# 开发

本目录是维护工程；完整安装产物位于 `dist/markdown-tree-view/`，安装步骤见[安装说明](docs/installation.md)。Node.js 开发基线见 [.node-version](.node-version)。

## 检查与构建

在本目录执行：

```sh
npm ci
npm run verify
```

`npm run check` 执行格式、类型感知 lint 和类型检查；`npm run format` 格式化维护代码、配置与文档。`npm run verify` 完成检查、构建、构建产物一致性校验和公开 CLI 行为测试。

格式、ESLint 和 TypeScript 的共同规则使用 [`@allurx/js-config`](https://github.com/allurx/allurx-build/tree/main/js-config)，JavaScript 类型基线沿用共享的 ES2025；文件范围及 Node.js 与浏览器的配置分离由本工程维护。

[`tsconfig.json`](tsconfig.json) 是统一入口，通过项目引用分开检查 [`tsconfig.node.json`](tsconfig.node.json) 和 [`tsconfig.browser.json`](tsconfig.browser.json)。`type-check` 执行 `tsc -b --noEmit`，`-b` 产生的构建状态记录保存在被忽略的 `node_modules/.cache/typescript/` 中；类型感知 ESLint 通过同一组项目引用识别各环境。

类型检查使用安装在 `@typescript/native` 别名下的 TypeScript 7；`typescript` 别名指向 `@typescript/typescript6`，为类型感知 ESLint 提供 TypeScript 6 API。两者分别提供 `tsc` 和 `tsc6`，项目脚本直接调用 `tsc`，无需指定包内路径。采用该并行方案的原因见 [Microsoft 的说明](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)；直接依赖与精确版本以 [package.json](package.json) 和锁文件为准。

Prettier 和 ESLint 默认从本目录检查，排除规则分别放在 [`.prettierignore`](.prettierignore) 和 [`eslint.config.ts`](eslint.config.ts)。CLI 示例保留原始 Markdown 语法与源行位置，Skill 界面元数据保留仓库规定的 YAML 缩进和双引号；其余维护代码、配置和文档使用共享排版规则。

单独构建或检查产物：

```sh
npm run build
npm run build -- --check
```

构建将 [assets/](assets/) 中的图标与浏览器资源内嵌到 CLI，生成第三方许可声明，并复制 [build.ts](build.ts) 明确列出的使用文件到交付目录。`--check` 比较全部应交付文件的内容，检查缺失和额外条目，不写文件或创建目录。构建发现额外条目或非普通文件时也会停止，保留现场；先检查来源，再决定是否移走这些条目，构建不会自动清理。

修改源码、资源、Skill 指令或交付文档后重新构建。`dist/` 由 Git 忽略，源码目录不保留旧的 `scripts/` bundle 或生成的第三方声明。新增必要使用文件时同步更新构建文件清单；开发说明、源码和开发依赖不进入安装目录。

## 持续验证与依赖更新

仓库 [CI](../../.github/workflows/ci.yml) 在 `main` 推送和 PR 中调用固定发行 SHA 的共享 Node CI，在本目录执行 `npm ci` 和 `npm run verify`。本地与 CI 均通过 [CLI 测试](tests/cli.test.ts)检查示例渲染、生成后的一致性和修改输入后的过期判断，确认 `--check` 不改写输出。其他纯文档 Skill 不参与 npm 构建。

[Renovate 配置](../../.github/renovate.json) 为 `main` 管理依赖更新，采用 [Allurx Build 共享策略](https://github.com/allurx/allurx-build/blob/main/docs/dependency-updates.md)。常规更新在全部检查通过后按策略自动合并，共享配置与工作流等基础设施更新保留人工审核。仓库需要完成 Renovate App 授权和 onboarding；配置文件本身不证明机器人已运行。更新合入 `main` 后不自动安装 Skill，也不发布构建产物。

## 源码入口

全部运行源码位于 [src/](src/)，CLI 入口为 [src/cli.ts](src/cli.ts)，构建入口为 [build.ts](build.ts)，Skill 指令维护于 [SKILL.md](SKILL.md)。安装开发依赖后可直接调试：

```sh
node src/cli.ts --input examples/guide.md --output work/guide.html
```

浏览器 TypeScript 会编译为内嵌 JavaScript。已构建的 CLI 无需 TypeScript 工具链；安装后的核对方式见[安装说明](docs/installation.md#核对安装)。
