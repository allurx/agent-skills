# Agent Skills

适用于 Codex 及兼容 Agent Skills 的可复用工作流。

## Skills

| Skill | 用途 |
| --- | --- |
| [`engineering-review-and-refactoring`](skills/engineering-review-and-refactoring/README.md) | 审查整体工程质量，在授权范围内实施必要的重构与修复 |
| [`global-instruction-review`](skills/global-instruction-review/README.md) | 从历史协作提炼并复核全局指令，核实覆盖并提供候选修改 |
| [`instruction-structurer`](skills/instruction-structurer/README.md) | 拆分并分类已有指令，改善查找并保留原意 |
| [`markdown-tree-view`](skills/markdown-tree-view/README.md) | 将 Markdown 转换为保留内容和标题层级的离线 HTML 折叠树 |
| [`novel-writing`](skills/novel-writing/README.md) | 规划、撰写、续写、修订与审阅小说，维护连续性与阅读体验 |

## 安装

先阅读目标 Skill 的 README，确认用途、运行条件和安装源：

- 纯文档 Skill：使用所选源码版本中的完整 `skills/<skill-name>/` 目录，无需构建或安装依赖。将 `<skill-name>` 替换为上表中的英文标识符。
- `markdown-tree-view`：按其[构建与安装说明](skills/markdown-tree-view/docs/installation.md)生成完整 `dist/markdown-tree-view/` 交付目录，安装该产物；源码目录不作为安装包。

### 安装与更新

将选定的完整目录复制到宿主的 Skill 搜索位置。Codex 个人通用 Skill 使用 `~/.agents/skills/<skill-name>/`，项目专用 Skill 使用项目的 `.agents/skills/<skill-name>/`；调用安装工具时显式指定目标目录。安装结果应直接包含 `<skill-name>/SKILL.md`，保留包内参考资料、脚本和许可证，避免再套一层同名目录。其他宿主使用其规定的位置，Codex 的发现机制见[官方技能文档](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills)。

更新前核对实际安装路径，将旧目录及本地定制备份到 Skill 搜索范围之外，再用新目录替换，避免合并复制遗留废弃文件。副本不会随源码自动更新；需要恢复时使用备份，并保留更新后需要合并的定制。安装或更新后，完成该 Skill 的特有检查，并在新任务中核对实际加载路径。

### 从本地源码维护

直接维护本仓库时，纯文档 Skill 可以使用指向其完整源码目录的链接，例如 Windows 目录联接（Junction）。这种方式会立即使用源码修改，只在明确接受该行为时采用；不要只链接 `SKILL.md` 或同时保留同一作用域的重复入口。源码目录移动后需更新链接。

需要构建的 Skill 仍按各自说明维护源码、交付产物和安装副本，不用源码链接代替构建。内置系统 Skill 和插件缓存由宿主管理，不随个人安装迁移。

## 使用

按名称调用并说明任务：

```text
使用 $instruction-structurer 整理这份指令文档，保留原意并按职责分类。
```

调用示例、特有条件和默认行为见各 Skill 的 README；详细执行流程由对应的 `SKILL.md` 及其引用资料维护。

## 许可证

仓库级文档和维护文件采用 [MIT 许可证](LICENSE.txt)。各 Skill 独立维护其目录中的 `LICENSE.txt`，许可范围以对应声明为准，并随完整目录分发。

第三方代码或素材保留其原有许可；用户输入和使用 Skill 生成的内容不会自动采用 MIT。
