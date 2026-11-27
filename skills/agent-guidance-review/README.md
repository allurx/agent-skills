# 指令与 Skill 评估

在准备换用新模型时，用一条命令评估全局协作指令和自己维护的全部 Skill。报告说明哪些做法值得保留、哪些需要调整，以及判断依据。评估入口自身也在覆盖范围内。

## 使用

```text
$agent-guidance-review
```

在要评估的模型下开始一个新会话，输入上面的命令即可。可以从其他项目调用。默认评估 `allurx/codex-dotfiles` 中的全局指令，以及 `allurx/agent-skills` 中现有和今后新增的 Skill。优先读取本地工作区；只有公开版本可读时，报告会标出版本和覆盖缺口。旧模型不可用时，仍可评估当前表现。

独立复核使用专用的 Codex CLI 环境。使用默认的 ChatGPT 账号登录配置时，CLI 会把材料发给 OpenAI，由与当前会话相同的模型评估。第一轮发送本次评估目标和代表性任务。第二轮在同一会话中发送全局 `AGENTS.md`、每个自维护 Skill 的 `SKILL.md`，以及本轮选作参考的文件全文，例如相关脚本或验证说明。

首次需要登录或登录失效时，按提示完成官方登录即可继续。专用环境位于用户主目录的 `.codex-agent-guidance-review` 下，两轮输入和回复保存在 `~/.codex-agent-guidance-review/sessions/` 下的 JSONL 会话文件中。文件名包含会话 ID，可用它定位本次复核记录。

报告会比较日常任务的实际表现和同一模型独立审阅旧稿的判断。正式复核前会检查启动输入，完成后核对本次会话的模型与结果。如果所选模型在 CLI 中不可用，或只能完成部分核对，报告会写明覆盖范围。[评估内容与判断方法](SKILL.md)

## 安装

安装完整的 `skills/agent-guidance-review/` 即可，无需构建。独立复核使用 Python 3 和支持 `debug prompt-input`、`exec --json` 的 Codex CLI。脚本只依赖 Python 标准库。直接维护本地源码时，可将个人安装入口链接到这个目录。两个维护仓库位于同一工作区时，可以从其他项目定位它们。[仓库安装说明](https://github.com/allurx/agent-skills#安装)

## 许可证

本 Skill 的自有指令、文档、校准样本和元数据采用 [Apache-2.0 许可证](LICENSE.txt)。
