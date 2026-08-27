---
name: agent-project-bootstrap
description: Audit and bootstrap a software repository for efficient agent-assisted development. Use only when explicitly asked to onboard a repository, perform a comprehensive repository-readiness audit, or create or systematically improve evidence-based scoped AGENTS.md files. Do not use for routine repository summaries, implementation, debugging, review, or refactoring.
---

# Agent Project Bootstrap

为软件仓库建立准确、精简、低维护成本的 Agent 工作上下文。初次审计可以投入较多 Context，但目标是降低后续任务反复探索的总成本；Token 优化不得以遗漏关键约束、降低正确性或跳过必要验证为代价。

## Respect the Requested Scope

- 只有用户明确要求实际创建或更新文件时才写入；审计、评估、建议、“应如何创建”或方案请求一律保持只读。
- 获得写入授权后，可以创建或更新适用且生效的 Agent 指引文件；没有现有指引时默认创建 `AGENTS.md`。
- 默认不安装依赖、不增加工具或 CI、不重构架构、不迁移数据，也不改变公共 API。把这些工程化缺口作为独立建议；只有用户明确授权后才实施。
- 未经明确要求，不创建额外的项目画像文档，不提交、不推送、不部署，也不修改外部系统。
- 只读或零写入约束覆盖 ignored 文件、构建产物、报告、缓存和依赖下载；会产生任何此类写入的命令都不运行，除非另获授权并使用合适的隔离环境。

根据请求选择最小充分模式：

- **Targeted instruction update**：只审计目标目录的有效指引链、相关配置、命令和风险，不生成完整项目画像，也不做全仓工程就绪度审计。
- **Comprehensive bootstrap audit**：用于首次接入或明确要求的全面复审，执行完整项目画像、指引 gap analysis 和工程就绪度审计。

## Protect the Repository

1. 确认目标仓库根目录、当前工作目录和任务覆盖范围。
2. 在 Codex 环境中，确认 `CODEX_HOME` 并在可访问时读取 active config 的 `project_doc_fallback_filenames` 与 `project_doc_max_bytes`；无法确认时，把 fallback 和大小限制标记为未验证，不凭记忆猜测。
3. 按真实发现优先级建立从仓库根到目标路径的 active instruction chain：每一级目录记录生效的 `AGENTS.override.md`、`AGENTS.md` 或已配置 fallback 文件，并标记被遮蔽的文件。Comprehensive 模式还要先枚举任务范围内的整个 instruction tree，避免漏掉其他子树的嵌套指引。
4. 若使用 Git，检查工作树和相关 diff，识别并保护用户已有修改；不要覆盖或顺手整理无关内容。
5. 避开依赖目录、构建产物、缓存、生成文件、vendor、大型二进制和与目标无关的内容。读取大型文本文件前先检查大小，只提取相关片段或元数据。不得读取或复制凭据、私钥、`.env` 值等敏感数据。

## Build an Evidence-Based Project Profile

仅在 comprehensive bootstrap audit 中建立完整项目画像。先建立低成本索引，再按证据逐步深入；“全面”指覆盖关键工程维度，不是逐个读取全部文件。

1. 枚举受版本控制的文件和顶层目录，识别仓库类型、workspace 或多模块边界。
2. 优先读取 README、manifest，以及 build、test、lint、format、typecheck、CI、release 和部署配置。对通常较大的 lockfile 只提取当前任务需要的包管理器、版本或依赖证据，不默认加载全文。
3. 从配置指向的入口、代表性模块、调用关系和测试继续追踪。仅在现有证据存在冲突、空白或高风险时扩大读取范围。
4. README、配置、代码与测试相互印证；不要把单一文档或通用生态惯例当作仓库事实。只有在当前状态无法解释时，才检查相关 Git 历史。
5. 当下列维度已有可靠证据，或已明确标记为未知/不适用时停止探索：
   - 项目目的、用户场景和不可破坏的产品约束；
   - 语言、运行时、包管理、构建与本地启动方式；
   - 目录职责、模块边界、入口和 source of truth；
   - 数据、迁移、兼容性、公共 API、安全、性能、离线或部署约束；
   - 测试层级、质量门禁、发布流程、生成内容、license/compliance 和禁止编辑区域；
   - 与项目类型相符的高风险契约。例如公共库的发布产物、API/module metadata 和独立消费者验证，或全局状态涉及的并发、生命周期、可重入性与测试隔离。

在最终报告中给出结构化项目画像，并把内容区分为已确认事实、合理推断和未解决问题。详细画像默认留在报告中，不全部写入每次任务都会加载的 `AGENTS.md`。

## Create or Improve AGENTS.md

先对现有有效指引做 gap analysis：保留仍然准确的用户规则和结构，修正已失效内容，合并重复规则，避免只在文件末尾不断追加。每条候选规则都应通过 admission test：有仓库证据、项目特有、常规重构后仍成立、不能轻易从当前文件推断，并会改变未来 Agent 的行动。

- 仓库根指引只保存适用于整个仓库的长期规则。仅当子系统确有不同命令、边界或风险时，才创建或更新嵌套文件。
- 同一目录存在 `AGENTS.override.md` 时，不要把被其遮蔽的 `AGENTS.md` 当作生效文件修改。若 override 与基础文件的长期意图不明确，先向用户确认应更新、移除还是保留哪一个。
- 保持内容精简、项目特有、可验证，优先记录：
  - 项目目标和稳定的产品、兼容性或交付边界；
  - 关键目录职责、模块边界和权威信息来源；
  - 从仓库配置验证过的高频命令、非显然的适用条件和最小命令集；
  - 与变更类型对应的最小验证要求；
  - 数据安全、生成文件、不可编辑区域和非显然的 recurring failure shields；
  - 指向现有权威文档或配置的相对路径。
- 不写入通用编程口号、完整文件树或依赖清单、易变化的类名和实现快照、当前 issue 状态、临时 workaround、未经验证的命令、尚未采用的理想实践、凭据或本机绝对路径。
- 不复制 formatter、linter、compiler 或 CI 已能稳定执行的机械规则；记录如何调用这些工具以及项目特有的例外即可。
- 对无法从仓库证据确认、但会实质改变长期工作方式的规则，先向用户确认，不猜测。
- 没有符合 admission test 的 durable gap 时，不修改指引也是正确结果。

## Audit Engineering Readiness

仅在 comprehensive bootstrap audit 中，结合项目技术栈、交付形态和风险检查可复现构建、依赖锁定、类型或静态检查、格式化与 lint、分层测试、CI、密钥与依赖安全、license/compliance、文档、发布和回滚能力。只展开与当前项目类型有关的检查，不要因为某项工具不存在就机械判定项目不合格；先判断它是否适用、是否已有等价保障。

将结果分类为：已覆盖、缺失、证据不足或不适用。合并简述不适用项，只详细展开有证据且会影响决策的风险；对缺口给出证据、实际风险、优先级和最小建议。若用户已明确授权实施某项补强，只完成最小一致变更，并遵循仓库现有架构和惯例。

## Verify and Report

- 核对写入 Agent 指引的路径、命令和约束都能追溯到当前仓库证据。
- 静态重建最终 active instruction chain，确认没有编辑被遮蔽的文件，并检查合并内容不会超过当前配置的项目指引大小限制。
- 环境具备合适的 Codex 指引来源检查能力时，从仓库根和至少一个有嵌套规则的代表性目录验证实际加载来源；无法验证时明确报告“内容已验证，运行时加载链未验证”。
- 在环境已就绪且不会隐式下载或改变外部状态时，运行低成本的针对性检查；需要安装依赖或扩大权限时先说明并请求授权。
- 审查最终 diff，确认没有意外改动、敏感信息、重复或过度具体的指引。
- Targeted 模式只报告目标指引、依据、验证和未解决问题；comprehensive 模式报告项目画像、指引变更、工程缺口及优先级、实际验证、未解决问题和建议的下一步。
- 未达到完成条件时明确说明，不声称已经得到绝对最低 Token 消耗或保证最理想结果。
