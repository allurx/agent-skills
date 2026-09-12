---
name: agent-project-bootstrap
description: Audit repository readiness or create and improve scoped AGENTS.md files from repository evidence when requested. Use for repository onboarding and instruction maintenance, not routine summaries, implementation, debugging, or code review.
---

# Agent Project Bootstrap

为软件仓库建立有证据、能改变后续 Agent 行动的工作指引。先按请求确定审计深度，再修复实际缺口；没有长期有效的缺口时，可以不改文件。

## Respect the Requested Scope

- 审计或建议请求保持受审对象只读；请求创建、修复或优化指引时，直接完成已授权范围内的调查、编辑和验证。不要把方案请求当作实施授权，也不要为已授权步骤反复确认。
- 指引维护不自动包含依赖安装、工具或 CI 建设、业务重构、数据迁移、Git 提交、发布或全局配置部署；工程缺口先作为建议报告。
- 检查命令的实际副作用。只读审计不在受审对象中产生 ignored 文件、构建产物或缓存；明确要求零写入时，报告和临时目录也受该限制。隔离检查仍须符合现有授权和权限。

根据请求选择最小充分模式：

- **定向维护**：核对目标目录的指引链，以及支持本次规则的配置、命令和风险，不扩展为全仓审计。
- **全面接入或复审**：额外读取 [references/comprehensive-audit.md](references/comprehensive-audit.md)，覆盖项目画像和工程就绪度。仅在此模式加载该参考。

## Protect the Repository

确认项目范围、当前启动工作目录（cwd）、目标编辑目录和 Git 状态，保留已有及无关修改。只读配置中与任务相关的键；不读取或输出凭据、私钥或 `.env` 值。优先使用文件索引和精确搜索，跳过依赖、生成物和大型无关文件。

## Resolve the Instruction Scope

修改前识别宿主实际使用的指引规则。以下是 Codex 的检查要点；其他 Agent 不套用 Codex 配置。

- 核对 `CODEX_HOME`、实际生效的 `project_root_markers`、`project_doc_fallback_filenames` 和 `project_doc_max_bytes`，按启动 cwd 解析项目发现根，不能直接用 Git 根替代。空 markers 或没有发现根时只检查该 cwd。
- 全局层在 Codex home 中按 `AGENTS.override.md`、`AGENTS.md` 选择首个非空指引；项目层从发现根到启动 cwd，逐层按 override、基础文件、配置的 fallback 顺序选择首个非空文件，每层最多一个，较深层规则覆盖冲突的上层规则。
- 记录选中的文件及被遮蔽的文件。目标目录与启动 cwd 不同时，单独核对其适用指引；目标目录的候选启动链不代表当前 run 已自动加载它。全面审计还要枚举范围内其他子树的嵌套指引。
- 有维护源与生效副本时区分两者。按用户指定目标修改；维护源更新不等于部署。override 的用途无法从现有证据判断且会改变长期规则时，再询问处理方式。

配置、发现根或加载行为不明时，查阅当前 [AGENTS.md 文档](https://learn.chatgpt.com/docs/agent-configuration/agents-md) 和 [项目发现配置](https://learn.chatgpt.com/docs/config-file/config-advanced)，并保留未验证项。静态文件检查不能证明当前会话的实际加载来源。

## Create or Improve AGENTS.md

先比较现有规则与仓库证据，修正失效内容、合并重复规则，保留准确的用户约定。新增规则应同时满足：有证据、属于该作用域、预计反复使用、不能轻易从源码或配置推断、遗漏会影响后续行动。明确的用户工作约定也是依据；不要把模型偏好包装成项目要求。

- 仓库根指引只保存适用于整个仓库的长期规则。仅当子系统确有不同命令、边界或风险时，才创建或更新嵌套文件。
- 保持内容精简、项目特有、可验证，优先记录：
  - 项目目标和稳定的产品、兼容性或交付边界；
  - 关键目录职责、模块边界和权威信息来源；
  - 从仓库配置验证过的高频命令、非显然的适用条件和最小命令集；
  - 与变更类型对应的最小验证要求；
  - 数据安全、生成文件、不可编辑区域和反复出现且不易察觉的失败条件；
  - 指向现有权威文档或配置的相对路径。
- 不写入通用编程口号、完整文件树或依赖清单、易变化的类名和实现快照、当前 issue 状态、临时 workaround、未经验证的命令、尚未采用的理想实践、凭据或本机绝对路径。
- 不复制 formatter、linter、compiler 或 CI 已能稳定执行的机械规则；记录如何调用这些工具以及项目特有的例外即可。
- 较长且可复用的任务流程放入 Skill；条件性细节引用现有文档，说明何时需要读取。不要创建无用的文档层或让每次任务加载整本手册。
- 只为无法合理推断、会实质改变行为或兼容性的选择询问用户，其余在已授权范围内继续。

## Verify and Report

- 核对路径、命令、条件和约束的证据；检查最终 diff、相对链接和规则冲突。按变更运行现有且符合授权的必要检查，区分执行验证与仅从配置确认。
- 重建目标启动目录的静态指引链，检查遮蔽和实际大小限制；规则放入嵌套文件并不保证它在从根目录启动的会话中自动加载。
- 修改生效指引后，环境允许时在目标 cwd 的新 run 验证加载来源；全面模式覆盖代表性嵌套目录。不要把提示中粘贴的规则当作启动加载证据。无法核验时报告“内容已验证，运行时加载链未验证”。
- 定向维护报告变更、依据、验证和剩余问题；全面模式补充项目画像和按优先级排列的工程缺口。区分已确认、推断和未知；报告实际 Git 状态，不宣称绝对最优或未经实测的效率收益。
