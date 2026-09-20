# Agent Skills

适用于 Codex 及兼容 Agent Skills 的可复用工作流。

## Skills

| Skill | 用途 |
| --- | --- |
| [`instruction-structurer`](skills/instruction-structurer/SKILL.md) | 拆分并分类已有指令，改善查找并保留原意 |
| [`markdown-tree-view`](skills/markdown-tree-view/SKILL.md) | 将 Markdown 转换为保留内容和标题层级的离线 HTML 折叠树 |
| [`staged-candid-character-photographer`](skills/staged-candid-character-photographer/SKILL.md) | 引导设置人物摄影参数，生成图片或提示词 |

## 安装

从选定的 commit 下载所需的 `skills/<skill-name>/` 完整目录，以副本形式放入 Codex 用户技能目录 `~/.agents/skills/`。其他宿主使用其规定的安装位置。详见[官方技能文档](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills)。

## 使用

按名称调用并说明任务：

```text
使用 $instruction-structurer 整理这份指令文档，保留原意并按职责分类。
```

具体要求见各技能的 `SKILL.md`；Markdown 转换命令见[使用说明](skills/markdown-tree-view/README.md)，摄影参数与示例见[摄影说明](skills/staged-candid-character-photographer/README.md)。

### 注意事项

- 副本不会自动更新；更新前备份本地定制，再替换完整目录。同一技能只保留一个可发现入口。
- `markdown-tree-view` 需要 Node.js 24 或更新版本；随附脚本已包含运行依赖，使用时无需 npm 安装。
- 实际出图需要宿主提供图像生成能力。
