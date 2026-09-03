---
name: codex-efficient-engineering
description: Optimize Codex-specific workflow decisions for existing software projects, including chat boundaries, Plan mode, Local versus Worktree, compaction, Fast Mode, and credit-aware execution. Use when the user asks how to organize or reduce the context, latency, or credit cost of Codex work, or explicitly asks to apply this workflow to a repository task. Do not use for repository onboarding, AGENTS.md creation, or ordinary implementation, debugging, refactoring, testing, or code review unless explicitly invoked to optimize the workflow.
metadata:
  short-description: Optimize Codex workflow, context, latency, and credits
---

# Codex Efficient Engineering

为既有软件工程选择合适的 Codex 工作组织方式和产品模式，在不牺牲正确性、必要验证或授权边界的前提下降低重复 Context、等待时间和 credit 消耗。

本 Skill 只处理 Codex workflow 决策，不重复仓库 onboarding、`AGENTS.md` 建设或通用编码流程。需要这些能力时使用相应专用 Skill 或遵循当前仓库指引。

## Respect Scope and Authority

- 区分 workflow 咨询与实际仓库任务。咨询、评估和方案请求保持只读，不修改仓库或外部状态。
- 不擅自创建 Chat、worktree 或 branch，不切换产品模式，不 handoff、commit、push 或部署；只有用户要求且当前环境支持时才执行相应操作。
- 用户显式要求将本流程应用于仓库任务时，简要完成必要决策后继续任务，不先输出通用教程，也不扩大原任务范围。
- 始终服从更高优先级指令、用户当前要求、仓库规范和实际权限。效率优化不得成为跳过必要证据或验证的理由。

## Establish the Operating Context

只确认会改变 workflow 选择的事实：

- 当前使用 ChatGPT desktop Codex、CLI、IDE extension、Cloud 还是其他环境；
- 工作是否依赖本地文件、IDE、设备、凭据或只能运行一个实例的服务；
- 仓库是否使用 Git，当前 checkout 是否有未提交改动；
- 任务是否需要并行、是否会修改相同文件，以及各部分是否可以独立验证；
- 当前瓶颈是 Context、credit、等待时间，还是环境隔离。

优先从当前项目和环境补全信息。只有缺失选择会实质改变结果、成本或权限时才询问用户。

产品功能、支持模型、命令、价格、倍率和套餐限制会变化。具体事实影响建议时，先核对最新官方 OpenAI Docs；无法确认则明确标记为未验证，不把旧行为固化为永久规则。

## Choose the Chat Boundary

- 一个 Chat 对应一个可独立验收的 outcome。同一目标下的诊断、实现、补测试和修复 review findings 留在当前 Chat。
- 新 feature、无关 bug、独立审计或不同交付物使用 New Chat，避免旧决策和新目标相互污染。
- 项目、仓库文档和 Agent 指引保存跨 Chat 的稳定上下文；Chat 只保留当前 outcome 所需的历史。
- 不为每个微步骤新建 Chat。边界明显且当前环境不能自动创建时，只向用户提出一次具体切换建议。

长任务在重大 milestone 或 handoff 前建立最小 checkpoint，保留：目标、约束、已确认决定、完成项、验证结果、未解决问题和下一步。

## Choose the Planning Level

范围小、目标明确、影响局部、现有模式清楚且容易验证时直接执行。

需求含糊、存在关键产品或架构选择，或涉及跨模块重构、schema、public API、兼容性迁移、高风险操作或多个独立 milestone 时先建立 plan。

区分两种概念：

- **Execution plan**：agent 为完成当前任务维护的简短步骤，可以在任务已经开始后创建或更新。
- **Plan mode**：Codex 产品提供的交互模式或命令，只在当前客户端支持且用户选择时使用。

不要声称已经替用户切换 Plan mode，也不要仅因任务运行期间无法切换 `/plan` 而暂停。用户只要求 plan 时不修改文件；用户已经要求实施且没有实质性待决选择时，完成必要 planning 后继续执行。

## Choose Local or Worktree

只有一个活跃 workflow、任务顺序执行或改动局部时默认使用 Local。

仅在 Git 仓库中且隔离确有收益时选择 Worktree，例如：

- 用户和 Codex 需要同时处理互不依赖的任务；
- 多个独立 Chat 需要后台并行且不能污染彼此 checkout；
- 先在隔离环境实现，再 handoff 到 Local 使用本地专用工具验证。

选择前确认起始 branch/ref、未提交改动、ignored 或 untracked 环境文件、依赖和工具准备方式，以及并行任务是否会修改同一文件或共享外部状态。

区分 Codex-managed worktree 与手工 `git worktree`；两者对未提交改动、detached HEAD、ignored 文件、setup 和 handoff 的行为可能不同。具体行为会影响安全性时先检查当前官方文档和实际状态，不凭通用 Git 经验猜测。不要让多个 worktree 同时 checkout 同一 branch。

Worktree 只隔离工作目录，不消除逻辑冲突、共享服务冲突或 merge 成本，也不是 Token 优化工具。并行通常会增加总 compute 和 credit 消耗。

## Control Compaction

- 自动 compaction 接近 Context 限制时可能发生；手动 compaction 的命令和可用性取决于当前客户端。
- 仅在长任务仍属于同一 outcome 且历史明显挤占有效 Context 时考虑手动 compact，并先保留最小 checkpoint。
- 不频繁 compact，也不把 compaction 当作无限延长混杂 Chat 的理由。
- 多次 compact 后若旧决策与当前状态混杂，或工作已成为独立 outcome，改用 New Chat 和最小 handoff。
- compaction 后以当前代码、diff、测试和运行结果为事实来源，重新核对关键约束，不依赖摘要替代证据。

## Choose Standard or Fast Mode

额度敏感、后台长任务、完整验证或等待时间不是主要瓶颈时优先 Standard。

只有低延迟能明显降低人工等待或协作成本，且额外 credit 消耗可接受时考虑 Fast Mode，例如高频交互式修改或紧急诊断。Fast Mode 用更高 credit 消耗换取较低延迟，不是 Token 或额度优化手段。

建议 Fast Mode 前核对当前模型支持情况、倍率、套餐余量和 usage dashboard。使用 API key 时按 API processing tier 与 token pricing 评估，不套用 ChatGPT credit 规则。

## Deliver the Decision

Workflow 咨询应给出一个明确推荐，并简述决定它的 Context、隔离、延迟、credit 和风险取舍。只展开当前场景相关的分支，不复述整套流程。

显式应用于实际任务时，只在必要处报告选择，例如是否需要 plan、继续当前 Chat、使用 Local 或 Worktree、保持 Standard 或启用 Fast；随后按任务本身的完成条件工作。无法验证的产品行为、未执行的 handoff 或模式切换必须明确说明。
