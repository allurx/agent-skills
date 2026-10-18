# 安装与更新

运行环境需要 Node.js 24 或更新版本；安装目录无需 npm 依赖。本文说明本 Skill 特有的构建与安装核对，共同的目标位置、更新和备份方式见[仓库安装与更新说明](https://github.com/allurx/agent-skills#安装)。若已经取得完整构建交付目录，可直接从“安装”开始。

## 取得源码并构建

从[源码仓库](https://github.com/allurx/agent-skills)取得所需版本，保留 `skills/markdown-tree-view/` 完整维护工程。在该目录执行：

```sh
npm ci
npm run verify
```

构建产物为维护工程下的 `dist/markdown-tree-view/`。它包含 Skill 入口、使用文档、界面元数据、示例、许可证和已内嵌运行依赖与页面资源的 `scripts/markdown-tree-view.mjs`。不需要额外 ZIP 或版本参数；需要可追溯安装时记录所选源码 commit。

`dist/` 是可重建产物，不提交 Git。安装时使用其中的完整 `markdown-tree-view/` 目录，保留 TypeScript 源码、原始资源、构建配置和 `node_modules/` 在维护工程中。

## 安装

将完整的 `dist/markdown-tree-view/` 目录复制到选定的 Skill 搜索位置；例如 Codex 个人安装位置为 `~/.agents/skills/markdown-tree-view/`。

安装结果应直接包含 `<skill-directory>/SKILL.md` 和 `<skill-directory>/scripts/markdown-tree-view.mjs`，不能再套一层同名目录。直接下载源码目录的通用安装器不会执行本 Skill 的构建步骤；使用它之前仍需按这里准备交付目录。

## 核对安装

在安装后的 Skill 目录运行：

```sh
node scripts/markdown-tree-view.mjs --help
node scripts/markdown-tree-view.mjs -i examples/guide.md -o work/guide.html
node scripts/markdown-tree-view.mjs -i examples/guide.md -o work/guide.html --check
```

三个命令均应成功；最后一个只比较已有 HTML，不写文件。用浏览器检查生成页面，再在新任务中按名称调用 `$markdown-tree-view`，核对加载路径。命令成功只证明 CLI 可运行，不代表旧任务已重新加载 Skill。

## 更新

从所选的新源码版本重新构建并验证交付目录，按仓库共同说明备份并替换安装副本，再执行上述安装核对。构建和复制安装不包含 commit、push、发布或部署操作。

## 独立 CLI

不使用 Skill 时，可单独复制交付目录中的 `scripts/markdown-tree-view.mjs`。该文件包含运行依赖、页面资源及完整许可声明，只需 Node.js 即可执行；完整 Skill 安装仍应保留全部交付文件。
