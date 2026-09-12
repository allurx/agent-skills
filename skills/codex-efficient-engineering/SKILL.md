---
name: codex-efficient-engineering
description: Optimize Codex workflow, context use, latency, and credit cost when requested. Choose task boundaries, planning, Local or Worktree, compaction, and speed settings. Not for routine coding or repository onboarding unless the user asks to optimize the workflow.
metadata:
  short-description: Optimize Codex workflow, context, latency, and credits
---

# Codex Efficient Engineering

为既有软件工程选择合适的 Codex 工作组织方式，在保持交付质量、必要验证和授权边界的前提下减少重复上下文、等待时间和额度消耗。效率以完成整个任务的成本衡量，不能只比较单次请求的 Token 数或单价。

只展开影响当前请求的决策，不要求每次依次执行全部章节。

## Respect Scope and Authority

- 区分 workflow 咨询与实际仓库任务。咨询、评估和方案请求保持只读，不修改仓库或外部状态。
- 建议新任务、隔离环境或模式不等于已经执行。创建用户可见的新任务、切换模型或费用设置、handoff、Git 提交和发布均遵守现有授权及工具约束；不要为了实施流程建议而额外修改全局配置。
- 用户显式要求将本流程应用于仓库任务时，简要完成必要决策后继续任务，不先输出通用教程，也不扩大原任务范围。

## Establish the Operating Context

只确认会改变 workflow 选择的事实：

- 当前使用 ChatGPT desktop Codex、CLI、IDE extension、Cloud 还是其他环境；
- 工作是否依赖本地文件、IDE、设备、凭据或只能运行一个实例的服务；
- 仓库是否使用 Git，当前 checkout 是否有未提交改动；
- 任务是否需要并行、是否会修改相同文件，以及各部分是否可以独立验证；
- 当前瓶颈是 Context、credit、等待时间，还是环境隔离。

优先从当前项目和环境补全信息。只有缺失选择会实质改变结果、成本或权限时才询问用户。

优先采用当前环境暴露的工具、模式和有效设置；只有具体产品行为影响决策时才查相应官方文档。支持模型、命令、价格、倍率和套餐限制不写成永久常量。无法核实时标明未知，不推测账户余量或将 API 计费套用为 ChatGPT credits。

## Choose the Chat Boundary

- 同一目标下的诊断、实现、验证和修复审查问题通常留在当前任务，避免丢失决策与授权。用户的补充、纠正和状态问题继续作用于该目标。
- 独立交付物或无关工作适合建议新任务；是否拆分取决于上下文复用、验收和协调成本，不能只按“新 feature”或任务长度机械划分。
- 只在得到相应授权后创建用户可见的新任务。当前目标内可独立验收的并行子任务可使用子 Agent；交代必要上下文、写入边界和验证责任，由主 Agent 整合结果。

在实际交接或容易丢失上下文的阶段保留简短交接信息：目标、约束、关键决定、已改文件、验证结果、未解决问题和下一步。不为每个微步骤创建文档。

## Choose the Planning Level

范围小、目标明确、影响局部、现有模式清楚且容易验证时直接执行。

需求含糊、存在关键产品或架构选择，或涉及跨模块重构、schema、public API、兼容性迁移、高风险操作或多个独立 milestone 时先建立 plan。

区分两种概念：

- **Execution plan**：agent 为完成当前任务维护的简短步骤，可以在任务已经开始后创建或更新。
- **Plan mode**：Codex 产品提供的交互模式或命令，只在当前客户端支持且用户选择时使用。

不要声称已经替用户切换 Plan mode，也不要仅因任务运行期间无法切换 `/plan` 而暂停。用户只要求 plan 时不修改文件；用户已经要求实施且没有实质性待决选择时，完成必要 planning 后继续执行。

## Choose Local or Worktree

已有任务优先沿用当前环境和用户选择。新任务再按隔离需求及当前工具默认值选择；单一顺序任务且依赖现有本地状态时，Local 通常足够。

仅在 Git 仓库中且隔离确有收益时选择 Worktree，例如：

- 用户和 Codex 需要同时处理互不依赖的任务；
- 多个独立 Chat 需要后台并行且不能污染彼此 checkout；
- 先在隔离环境实现，再 handoff 到 Local 使用本地专用工具验证。

选择前确认起始 branch/ref、未提交改动、ignored 或 untracked 环境文件、依赖和工具准备方式，以及并行任务是否会修改同一文件或共享外部状态。

区分 Codex-managed worktree 与手工 `git worktree`；两者对未提交改动、detached HEAD、ignored 文件、setup 和 handoff 的行为可能不同。具体行为会影响安全性时先检查当前官方文档和实际状态，不凭通用 Git 经验猜测。不要让多个 worktree 同时 checkout 同一 branch。

Worktree 只隔离工作目录，不消除逻辑冲突、共享服务冲突或整合成本。并行是否节省时间取决于独立性和验证成本，总额度可能增加；不能保证省 Token。涉及当前客户端的 setup、ignored 文件复制或 handoff 时，按需查 [Worktrees 文档](https://learn.chatgpt.com/docs/environments/git-worktrees)。

## Control Compaction

- 接近上下文限制时由客户端处理自动压缩；手动命令和支持情况以当前客户端为准，不声称能从普通工具替用户切换。
- 同一目标的长任务优先利用已有摘要继续，保留未完成工作和授权；压缩本身不代表任务结束，也不要求新建任务。
- 历史明显挤占有效上下文且客户端支持时才考虑手动压缩。以当前代码、diff 和实际验证为事实来源，按需要复核关键约束，不每次重新扫描全仓。
- 若工作已独立或旧决策混杂，再建议新任务并准备最小交接信息；不要按压缩次数设置硬阈值。

## Choose Standard or Fast Mode

先区分模型能力、reasoning effort 和速度档位。保留用户明确的模型选择；改变模型与开启同一模型的 Fast 是不同决策。不能仅因低单价就推断任务总成本更低，也不能把必要验证绑定到某种速度档位。

额度优先且延迟不是主要瓶颈时倾向 Standard；人工等待成本显著且额外额度可接受时考虑 Fast。Fast 用更高额度消耗换取较低延迟，不等于换用一个能力更低的模型。

作具体费用建议时核对当前 [Speed 文档](https://learn.chatgpt.com/docs/agent-configuration/speed) 中的支持情况与倍率；账户余量使用当前可用的 usage 工具或用户提供的数据。API key 按 API processing tier 和 token pricing 单独评估。

## Deliver the Decision

Workflow 咨询应给出一个明确推荐，并简述决定它的 Context、隔离、延迟、credit 和风险取舍。只展开当前场景相关的分支，不复述整套流程。

显式应用于实际任务时，只在必要处报告选择，例如是否需要 plan、继续当前 Chat、使用 Local 或 Worktree、保持 Standard 或启用 Fast；随后按任务本身的完成条件工作。无法验证的产品行为、未执行的 handoff 或模式切换必须明确说明。
