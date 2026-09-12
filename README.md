# Agent Skills

适用于 Codex 及兼容 Agent Skills 的工作流集合，覆盖软件工程、聊天整理和人物摄影。

## Skills

| 分类 | Skill | 用途 |
| --- | --- | --- |
| 软件工程 | [`agent-project-bootstrap`](skills/agent-project-bootstrap/SKILL.md) | 项目接入与指引审计，创建或完善 `AGENTS.md` |
| 软件工程 | [`codex-efficient-engineering`](skills/codex-efficient-engineering/SKILL.md) | 优化 Codex 的任务拆分、模式和工作区选择，减少上下文与额度消耗 |
| 聊天管理 | [`chatgpt-history-organizer`](skills/chatgpt-history-organizer/SKILL.md) | 审计、重命名和归类 ChatGPT 网页聊天 |
| 图像创作 | [`staged-candid-character-photographer`](skills/staged-candid-character-photographer/SKILL.md) | 引导设置人物摄影参数，支持真人与虚构角色，生成图片或完整提示词 |

## 使用

将所需的 `skills/<skill-name>/` 完整目录安装到 Agent 的 Skills 目录，然后用名称调用并说明目标，例如：

```text
使用 $agent-project-bootstrap 审计当前仓库，不修改文件。
```

具体触发条件、参数和工具要求见各 Skill 的 `SKILL.md`。文件修改、对外操作和发布均以用户授权为准。

通过复制安装时，更新同名 Skill 的完整目录，并保留需要的本地定制；更新仓库不会自动更新已安装副本。

在本机持续开发 Codex Skill 时，可将安装位置的单个 Skill 目录链接到仓库 `skills/<skill-name>/` 的完整目录。Codex 支持符号链接；Windows 使用目录联接（Junction）时，还应验证当前宿主能发现并读取目标。这样修改源码后无需反复复制或从远程重新安装，commit 和 push 按版本管理需要进行。链接也会随未提交修改和分支切换变化；同一 Skill 只保留一个可发现入口，避免重复安装。操作前备份已有安装中的本地定制。参见 [Codex 官方技能文档](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills)。

更新后按所用 Agent 的加载方式确认新版本已可用。Codex 会自动检测技能变更；更新未显示时重启 Codex，重要行为变化在新任务中验证。
