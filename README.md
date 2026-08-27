# Agent Skills

面向 Codex 及兼容 Agent Skills 的可复用工作流集合。每个 Skill 保持独立、精简，只在相关任务中加载，以减少不必要的 Context 与 Token 消耗。

## Available Skills

- [agent-project-bootstrap](skills/agent-project-bootstrap/SKILL.md) — 审计并接入软件仓库，形成项目画像，创建或完善基于仓库证据的 `AGENTS.md`，并报告值得补强的工程实践。

该 Skill 用于项目首次接入、全面复审或有目标地整理项目指引，不用于日常实现、调试、评审或重构。它默认只修改已获授权且实际生效的 Agent 指引文件；依赖、CI、架构和其他工程化改造会先作为建议报告，得到明确授权后才实施。

## Repository Layout

```text
skills/
└── <skill-name>/
    └── SKILL.md
```

`SKILL.md` 保存 Skill 的通用目的、关键约束和核心 workflow。只有当某类任务确实需要较多条件化细节时，才增加 `references/`、`scripts/` 或 `assets/`，并从 `SKILL.md` 按需引用。

## Usage

将 Skill 安装或链接到 Agent 的 Skills 目录后，显式调用：

```text
使用 $agent-project-bootstrap 审计并接入这个仓库，创建或完善 AGENTS.md。
```

支持自动发现的 Agent 也可以依据 frontmatter 中的 `name` 与 `description` 判断是否加载。

## Maintenance

- 保持 `description` 简短、准确，并明确适用与排除场景。
- 只保留会影响 Agent 决策的规则，避免重复常识或累积一次性例外。
- 根据真实任务和已验证的问题小步修订。
- 保持 Skill 自包含；仅在有明确收益时增加辅助资源。
