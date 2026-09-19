# Agent Skills

适用于 Codex 及兼容 Agent Skills 的可复用工作流。

## Skills

| Skill | 用途 |
| --- | --- |
| [`instruction-structurer`](skills/instruction-structurer/SKILL.md) | 拆分并分类已有指令，改善查找并保留原意 |
| [`chatgpt-history-organizer`](skills/chatgpt-history-organizer/SKILL.md) | 根据内容审计、重命名和归类 ChatGPT 网页聊天 |
| [`staged-candid-character-photographer`](skills/staged-candid-character-photographer/SKILL.md) | 引导设置人物摄影参数，生成图片或完整提示词 |

## 使用

将所需的 `skills/<skill-name>/` 完整目录安装到所用 Agent 的技能目录，再按名称调用并说明任务：

```text
使用 $instruction-structurer 整理这份指令文档，保留原意并按职责分类。
```

具体用途和工具要求见各 Skill 的 `SKILL.md`。Codex 的安装位置参见[官方技能文档](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills)。

本地开发可将安装位置链接到仓库中的对应技能目录；Windows 使用目录联接（Junction）时，需验证宿主能发现并读取目标。

### 注意事项

- 复制安装需手动更新完整目录；仓库更新不会自动同步已安装副本，更新前备份本地定制。
- 链接安装会随源码修改和分支切换变化。同一技能只保留一个可发现入口，安装或更新后确认宿主已加载。
