# Agent Skills

面向 Codex 及兼容 Agent Skills 的可复用工作流集合。每个 Skill 保持独立、精简，只在相关任务中加载，以减少不必要的 Context 与 Token 消耗。

## Available Skills

- [efficient-development](skills/efficient-development/SKILL.md) — 在现有软件项目中按需探索、遵循项目约束、实施最小一致变更并进行针对性验证。

## Repository Layout

```text
skills/
└── <skill-name>/
    └── SKILL.md
```

`SKILL.md` 保存 Skill 的通用目的、关键约束和核心 workflow。只有当某类任务确实需要较多条件化细节时，才增加 `references/`、`scripts/` 或 `assets/`，并从 `SKILL.md` 按需引用。

## Usage

将所需 Skill 安装或链接到 Agent 的 Skills 目录后，可以显式调用：

```text
使用 $efficient-development 修复这个问题，并运行相关验证。
```

支持自动发现的 Agent 也可以依据 frontmatter 中的 `name` 与 `description` 判断是否加载。

## Maintenance

- 保持 `description` 简短、准确，并明确适用场景。
- 只保留会影响 Agent 决策的规则，避免重复常识或累积一次性例外。
- 根据真实任务和已验证的问题小步修订。
- 保持 Skill 自包含；仅在有明确收益时增加辅助资源。
