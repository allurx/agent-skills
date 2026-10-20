# Agent Skills

English | [简体中文](README.zh-CN.md)

Reusable workflows for Codex and other hosts that support Agent Skills.

Individual Skill READMEs, `SKILL.md` instructions, and detailed guides linked below are in Simplified Chinese.

## Skills

| Skill                                                                                       | Purpose                                                                                                      |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [`engineering-review-and-refactoring`](skills/engineering-review-and-refactoring/README.md) | Review overall engineering quality and carry out necessary refactoring and fixes within the authorized scope |
| [`global-instruction-review`](skills/global-instruction-review/README.md)                   | Review or update global instructions, derive requirements from history, and assess related feedback       |
| [`instruction-structurer`](skills/instruction-structurer/README.md)                         | Split and organize existing instructions to improve navigation while preserving their meaning                |
| [`markdown-tree-view`](skills/markdown-tree-view/README.md)                                 | Convert Markdown into an offline collapsible HTML tree that preserves content and heading hierarchy          |
| [`novel-writing`](skills/novel-writing/README.md)                                           | Plan, write, continue, revise, and review novels while maintaining continuity and reading quality            |

<a name="安装"></a>

## Installation

Read the target Skill's README first to confirm its purpose, runtime requirements, and installation source:

- **Documentation-only Skills:** Use the complete `skills/<skill-name>/` directory from the chosen source version. No build or dependency installation is required. Replace `<skill-name>` with an identifier from the table above.
- **`markdown-tree-view`:** Follow its [build and installation guide](skills/markdown-tree-view/docs/installation.md) to generate the complete `dist/markdown-tree-view/` distribution directory, then install that output. The source directory is not an installation package.

### Installing and updating

Copy the complete selected directory to the host's Skill discovery location. For Codex, use `~/.agents/skills/<skill-name>/` for personal Skills or the project's `.agents/skills/<skill-name>/` for project-specific Skills. Explicitly specify the destination when using an installation tool. The installed directory must contain `<skill-name>/SKILL.md` directly, together with its references, scripts, and license; avoid an extra nested directory with the same name. Other hosts use their own discovery locations. See the [official Skill documentation](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills) for Codex discovery rules.

Before updating, verify the actual installation path and back up the old directory and any local customizations outside the Skill search locations. Replace it with the new directory rather than merging copies that could leave obsolete files behind. Installed copies do not update automatically with the source. Restore from the backup when needed, retaining any later customizations that must be merged. After installing or updating, run the Skill's specific checks and verify the loaded path in a new task.

### Maintaining a local source checkout

When maintaining this repository directly, documentation-only Skills can use a link to their complete source directory, such as a Windows directory junction. This makes source edits take effect immediately; use it only when that behavior is intended. Do not link only `SKILL.md` or keep duplicate entries in the same scope. Update the link if the source directory moves.

For Skills that require a build, keep the source, distribution output, and installed copy separate as described in their documentation. A source link does not replace the build. Built-in system Skills and plugin caches are managed by the host and are not part of personal Skill migration.

## Usage

Invoke a Skill by name and describe the task:

```text
Use $instruction-structurer to organize this instruction document by responsibility while preserving its meaning.
```

Each Skill's README provides invocation examples, specific requirements, and default behavior. Its `SKILL.md` and referenced materials define the detailed execution procedure.

## License

Repository-level documentation and maintenance files use the [Apache-2.0 license](LICENSE.txt). Each Skill maintains its own `LICENSE.txt`; the corresponding notice defines its scope and is distributed with the complete Skill directory.

Third-party code and materials retain their original licenses. User input and content generated with a Skill do not automatically inherit Apache-2.0.
