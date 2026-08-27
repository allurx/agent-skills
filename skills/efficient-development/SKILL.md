---
name: efficient-development
description: Guide efficient software development in existing repositories by loading only necessary context, following repository instructions, making minimal coherent changes, and verifying proportionally. Use for analyzing, implementing, debugging, refactoring, or maintaining an existing codebase.
---

# Efficient Development

在现有软件项目中，以最少但充分的 Context 完成可验证的高质量工作。减少 Token 是优化目标，不得以遗漏约束、降低正确性或跳过必要验证为代价。

## Operating Principles

- 以仓库事实和运行结果为依据，不凭惯例猜测当前实现。
- 从最接近任务的文件、符号和测试开始，只有在存在未解决的依赖、约束或风险时才扩大范围。
- 遵循现有架构和风格，选择能够完整解决问题的最小一致变更。
- 保留用户已有修改，不把当前任务扩展为无关重构、清理、迁移或依赖升级。
- 严格遵守授权边界；分析或编辑代码的授权不等于提交、推送、部署或修改外部系统的授权。

## Workflow

1. **Define the Outcome**
   - 区分分析、诊断、评审与实际修改，不擅自扩大请求范围。
   - 明确可观察结果、完成条件和已授权操作。
   - 信息足以安全推进时作合理假设；若选择会实质改变结果或扩大权限，先请求用户决定。

2. **Load Governing Context**
   - 查找并完整阅读适用于目标路径的 `AGENTS.md` 及其他仓库说明。
   - 若项目使用 Git，检查工作树和相关 diff，识别并保护已有修改。
   - 使用精确搜索定位入口、符号、调用方和相关测试，避免无目的遍历整个仓库。

3. **Read on Demand**
   - 先读取完成任务所需的最小文件集；只有新证据表明有必要时才扩展 Context。
   - 优先读取相关源文件和最近的测试；除非排错需要，避开生成文件、依赖目录和大型无关文件。
   - 不重复加载未变化且已经掌握的内容。

4. **Establish Evidence**
   - 对缺陷修复，在条件允许时先复现问题或确认可靠的失败路径。
   - 检查现有测试、历史约定和实际调用关系，区分已确认事实与推断。
   - 选择能解决根因且与现有职责边界一致的方案。

5. **Make the Smallest Coherent Change**
   - 保持 API、类型、职责边界和项目惯例一致。
   - 只添加用于解释关键理由或非显然约束的注释。
   - 除非请求明确要求或完成目标确有必要，不增加兼容层、数据迁移、配置变更或顺手优化。

6. **Verify Proportionally**
   - 先运行受影响范围内的 targeted tests、typecheck、lint 或 build。
   - 如果变更跨越模块、公共 API、数据格式或运行时边界，补充相应的 broader verification 或真实场景验证。
   - 修复缺陷后重新运行原始 regression；不要把 build 通过当作运行时行为已经得到证明。
   - 最后检查 diff，确认没有意外改动。

7. **Report Evidence**
   - 简洁说明完成结果、关键变更以及实际执行的验证。
   - 明确披露未验证风险、阻塞项和影响结论的假设。
   - 未达到完成条件时，不把任务表述为已经完成。
