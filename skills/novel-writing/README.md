# 小说创作与修订

根据当前任务与作品资料，完成小说规划、写作、续写、修订、审阅或校对，兼顾人物、情节、连续性与阅读体验。也可直接讨论具体创作问题，不绑定工程、题材或作品。

## 安装

从选定的源码版本取得完整 `skills/novel-writing/` 目录，以副本形式放入 Codex 用户技能目录 `~/.agents/skills/novel-writing/`，或其他宿主规定的位置。此 Skill 仅包含指令和参考资料，无需构建或安装依赖；保留整个目录，包含 [SKILL.md](SKILL.md)、[创作判断参考](references/craft-guide.md)、[研究来源与作品样本](references/research-sources.md)、[界面元数据](agents/openai.yaml) 和 [许可证](LICENSE.txt)。安装位置及发现规则见 [Codex 官方技能文档](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills)。

更新前将既有目录及本地定制备份到 Skill 搜索范围之外，再用新目录替换，避免合并复制遗留旧文件。同一 Skill 只保留一个可发现入口，安装后核对实际加载路径。

在同一台机器上直接维护本仓库时，也可以让用户技能目录中的 `novel-writing` 链接到仓库的完整 `skills/novel-writing/` 目录，例如使用 Windows 目录联接（Junction）。这种方式会立即使用源码修改，适合接受这一行为的维护者；不要只链接 `SKILL.md`，也不要同时保留同名安装副本。目录移动后需要更新链接。

## 使用

```text
使用 $novel-writing，审阅我提供的小说章节，分析人物动机、情节衔接和阅读体验，先给出判断，不修改正文。
```

也可明确要求规划、写作、续写、修订或校对，并提供相应作品资料；一般创作讨论无需先建立工程或作品档案。工作方式与交付边界见 [SKILL.md](SKILL.md)。

## 创作方法与维护

[创作判断参考](references/craft-guide.md) 是通用方法的主要正文，覆盖故事发展、人物、叙事、语言和阅读体验；[研究来源与作品样本](references/research-sources.md) 保存对应来源、样本观察、日期及证据边界。按问题读取，不将作者经验或局部样本当作所有作品的规则。

通用方法可在本 Skill 所在工程中讨论和维护。一般讨论只回应问题，明确要求维护时才修改 Skill；具体作品的正文、设定、计划和反馈应在其独立资料位置维护，不放入可复用 Skill。

## 许可证

本 Skill 的自有指令与文档采用 [MIT 许可证](LICENSE.txt)。引用资料保留原有权利；用户输入和生成的小说内容不会自动采用 MIT。
