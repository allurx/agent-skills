# Skill 安装

安装或更新 Skill 前，先阅读目标 Skill 的 README 及其引用的安装文档，再选择安装工具和来源目录。通用安装、更新与本地源码维护方式集中在[仓库 README](README.md#安装)，各 Skill README 保留特有的来源目录、运行条件和必要步骤。

本机个人通用 Skill 统一安装到 `~/.agents/skills/`，调用安装工具时显式指定目标目录，不依赖工具默认值。项目专用 Skill 使用项目的 `.agents/skills/`；内置系统 Skill 和插件缓存由宿主管理，不随个人安装迁移。源码、构建交付目录及安装副本按各 Skill 的说明区分；目录链接只用于明确采用的本地维护方式。

# Skill 格式

- 文档按读者职责分工：README 面向使用者，`SKILL.md` 面向执行任务的 Agent，详细方法和参考依据按需放在包内引用资料中。随 Skill 独立分发的文档引用包外维护资料时使用公开仓库链接，包内资料使用相对链接；执行必需资源保留在交付目录内。

- `SKILL.md` 的 front matter 依次使用 `name`、`description`、`license`，其他必要字段追加在后。`name` 与目录名一致，保留英文标识符；描述和面向使用者的文案使用简体中文，技术标识符保留原文，许可信息依据对应声明填写。
- 同一 Skill 的 `SKILL.md`、README 一级标题与 `interface.display_name` 使用一致的中文名称。README 的“使用”部分先提供包含 `$<skill-name>` 的完整调用示例，再按需说明其他使用方式。
- `agents/openai.yaml` 的 `interface` 依次提供 `display_name`、`short_description`、`default_prompt`，采用两空格缩进和双引号字符串。默认提示词简短说明典型任务并包含准确的 `$<skill-name>`，不重复完整工作流或扩大授权。
- 正文标题按各 Skill 的实际职责组织，保留必要的工作流和配套资源，不强制相同章节或目录结构。已有生成物通过对应构建流程同步。
