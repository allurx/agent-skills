# 工程质量审查与重构

对指定项目或范围进行整体工程质量审查，并在授权范围内完成必要的重构与修复。覆盖需求与设计、职责与依赖、复杂性、正确性、产品体验、验证及交付；保留合理设计，以真实用例和证据判断改进价值。

## 安装

无需构建，安装源为完整 `skills/engineering-review-and-refactoring/` 目录。按[仓库安装与更新说明](https://github.com/allurx/agent-skills#安装)选择目标位置，并保留整个目录。

## 使用

在目标工程中调用，并说明需要限制的范围：

```text
使用 $engineering-review-and-refactoring 审查当前工程，并实施必要的重构与修复。
```

也可以只要求审查：

```text
使用 $engineering-review-and-refactoring 仅审查当前工程的存储模块，给出有依据的建议，不修改文件。
```

仅给出 Skill 名称与目标项目时，默认执行审查及范围内必要的重构与修复。仅要求审计、评估、建议、方案或 review 时保持只读；提交、推送、PR、合并、发布和部署等操作仍需对应授权。完整判断标准与执行边界见 [SKILL.md](SKILL.md)。

## 许可证

本 Skill 采用 [Apache-2.0 许可证](LICENSE.txt)。受审项目及其内容仍按各自的许可和授权处理。
