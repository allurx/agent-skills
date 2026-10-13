# Skill 安装

安装或更新 Skill 前，先阅读目标 Skill 的 README 及其引用的安装文档，再选择安装工具和来源目录。各 Skill 的入口见[仓库 README](README.md#skills)。

# Skill 格式

- `SKILL.md` 的 front matter 依次使用 `name`、`description`、`license`，其他必要字段追加在后。`name` 与目录名一致，保留英文标识符；描述和面向使用者的文案使用简体中文，技术标识符保留原文，许可信息依据对应声明填写。
- 同一 Skill 的 `SKILL.md`、README 一级标题与 `interface.display_name` 使用一致的中文名称。README 的“使用”部分先提供包含 `$<skill-name>` 的完整调用示例，再按需说明其他使用方式。
- `agents/openai.yaml` 的 `interface` 依次提供 `display_name`、`short_description`、`default_prompt`，采用两空格缩进和双引号字符串。默认提示词简短说明典型任务并包含准确的 `$<skill-name>`，不重复完整工作流或扩大授权。
- 正文标题按各 Skill 的实际职责组织，保留必要的工作流和配套资源，不强制相同章节或目录结构。已有生成物通过对应构建流程同步。
