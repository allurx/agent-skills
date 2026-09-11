# Agent Skills

适用于 Codex 及兼容 Agent Skills 的工作流集合，覆盖软件工程、聊天整理和角色摄影。

## Skills

| 分类 | Skill | 用途 |
| --- | --- | --- |
| 软件工程 | [`agent-project-bootstrap`](skills/agent-project-bootstrap/SKILL.md) | 项目接入与指引审计，创建或完善 `AGENTS.md` |
| 软件工程 | [`codex-efficient-engineering`](skills/codex-efficient-engineering/SKILL.md) | 优化 Codex 的任务拆分、模式和工作区选择，减少上下文与额度消耗 |
| 聊天管理 | [`chatgpt-history-organizer`](skills/chatgpt-history-organizer/SKILL.md) | 审计、重命名和归类 ChatGPT 网页聊天 |
| 图像创作 | [`staged-candid-character-photographer`](skills/staged-candid-character-photographer/SKILL.md) | 引导设置成年虚构角色的摄影参数，生成图片或完整提示词 |

## 使用

将所需的 `skills/<skill-name>/` 完整目录安装到 Agent 的 Skills 目录，然后用名称调用并说明目标，例如：

```text
使用 $agent-project-bootstrap 审计当前仓库，不修改文件。
```

具体触发条件、参数和工具要求见各 Skill 的 `SKILL.md`。文件修改、对外操作和发布均以用户授权为准。
