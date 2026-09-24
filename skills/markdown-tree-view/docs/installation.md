# 安装与更新

运行环境需要 Node.js 24 或更新版本；安装目录无需 npm 依赖。若已经取得完整构建交付目录，可直接从“安装”开始。

## 取得源码并构建

从[源码仓库](https://github.com/allurx/agent-skills)取得所需版本，保留 `skills/markdown-tree-view/` 完整维护工程。在该目录执行：

```sh
npm ci
npm run verify
```

构建产物为维护工程下的 `dist/markdown-tree-view/`。它包含 Skill 入口、使用文档、界面元数据、示例、许可证和已内嵌运行依赖与页面资源的 `scripts/markdown-tree-view.mjs`。不需要额外 ZIP 或版本参数；需要可追溯安装时记录所选源码 commit。

`dist/` 是可重建产物，不提交 Git。安装时使用其中的完整 `markdown-tree-view/` 目录，保留 TypeScript 源码、原始资源、构建配置和 `node_modules/` 在维护工程中。

## 安装

将完整交付目录作为副本放入宿主的 Skill 搜索位置。Codex 用户级示例为 `~/.agents/skills/markdown-tree-view/`；其他宿主采用其规定的位置。详见[Codex 官方技能文档](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills)。

Windows PowerShell 首次安装示例，在上述维护工程目录执行：

```powershell
$distributionPath = (Resolve-Path -LiteralPath 'dist/markdown-tree-view').Path
$skillDestination = Join-Path $env:USERPROFILE '.agents/skills/markdown-tree-view'
if (Test-Path -LiteralPath $skillDestination) {
    throw '目标已存在，请先按更新说明备份并移出旧目录。'
}
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $skillDestination) | Out-Null
Copy-Item -LiteralPath $distributionPath -Destination $skillDestination -Recurse
```

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

从所选的新源码版本重新构建并验证交付目录。副本不会自动更新；先核对实际安装路径，把既有 Skill 目录及本地定制移到 Skill 搜索范围之外的备份位置，再安装新的完整目录。不要把新文件直接合并进旧目录而遗留废弃文件，同一 Skill 只保留一个可发现入口。

再次执行安装核对。需要恢复时，将备份目录放回原安装位置，保留可能需要合并的本地定制。构建和复制安装不包含 commit、push、发布或部署操作。

## 独立 CLI

不使用 Skill 时，可单独复制交付目录中的 `scripts/markdown-tree-view.mjs`。该文件包含运行依赖、页面资源及完整许可声明，只需 Node.js 即可执行；完整 Skill 安装仍应保留全部交付文件。
