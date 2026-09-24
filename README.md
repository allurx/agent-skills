# Agent Skills

适用于 Codex 及兼容 Agent Skills 的可复用工作流。

## Skills

| Skill | 用途 |
| --- | --- |
| [`instruction-structurer`](skills/instruction-structurer/README.md) | 拆分并分类已有指令，改善查找并保留原意 |
| [`markdown-tree-view`](skills/markdown-tree-view/README.md) | 将 Markdown 转换为保留内容和标题层级的离线 HTML 折叠树 |
| [`staged-candid-character-photographer`](skills/staged-candid-character-photographer/README.md) | 引导设置人物摄影参数，生成图片或提示词 |

## 安装

安装或更新前，先阅读上表中目标 Skill 的 README 及其引用的安装说明，再选择安装方式。`markdown-tree-view` 需从源码构建完整交付目录；另外两个纯文档 Skill 可直接安装各自的完整目录。具体步骤在各 Skill 中维护。

## 使用

按名称调用并说明任务：

```text
使用 $instruction-structurer 整理这份指令文档，保留原意并按职责分类。
```

具体要求见各技能的 `SKILL.md`；Markdown 转换命令见[使用说明](skills/markdown-tree-view/README.md)，摄影参数与示例见[摄影说明](skills/staged-candid-character-photographer/README.md)。

### 注意事项

- 实际出图需要宿主提供图像生成能力。

## 许可证

仓库级文档和维护文件采用 [MIT 许可证](LICENSE.txt)。各 Skill 独立维护其目录中的 `LICENSE.txt`，许可范围以对应声明为准，并随完整目录分发。

第三方代码或素材保留其原有许可；用户输入和使用 Skill 生成的内容不会自动采用 MIT。
