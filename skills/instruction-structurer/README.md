# 指令结构整理

对已有全局指令、`AGENTS.md` 或团队规范做语义保真的拆分、命名和递归分类，让独立要求可通过标题找到。适用于整理长句、调整指令层级和审计可查找性；不用于补写新政策。

## 安装

从选定的源码版本取得完整 `skills/instruction-structurer/` 目录，以副本形式放入 Codex 用户技能目录 `~/.agents/skills/instruction-structurer/`，或其他宿主规定的位置。此 Skill 仅包含指令和参考资料，无需构建或安装依赖。保留 [SKILL.md](SKILL.md)、[参考示例](references/examples.md)、界面元数据和许可证；只复制入口文件会遗漏引用资料。

更新前将既有目录及本地定制备份到 Skill 搜索范围之外，再用新目录替换；不要合并复制而遗留旧文件。同一 Skill 只保留一个可发现入口，重新开启任务后核对加载的路径。安装位置及发现规则见[Codex 官方技能文档](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills)。

## 使用

```text
使用 $instruction-structurer 整理这份 AGENTS.md，保留原意并按职责分类。
```

可仅要求审计，也可明确要求直接修改。完整工作流及语义核对要求见 [SKILL.md](SKILL.md)。

## 许可证

本 Skill 的自有指令、文档和示例采用 [MIT 许可证](LICENSE.txt)。待整理文档仍按其原有授权处理。
