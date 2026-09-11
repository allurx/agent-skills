# Agent Skills

面向 Codex 及兼容 Agent Skills 的可复用工作流集合。每个 Skill 聚焦一个明确任务边界，只在相关请求中加载，从而复用经过验证的决策、操作步骤和验收标准，而不让无关规则长期占用 Context。

## Skills 分类

### 软件工程与 Codex 工作流

| Skill | 适用场景 | 核心结果 |
| --- | --- | --- |
| [`agent-project-bootstrap`](skills/agent-project-bootstrap/SKILL.md) | 项目首次接入、全面复审或定向完善项目指引 | 基于仓库证据形成项目画像，创建或完善实际生效的 `AGENTS.md`，并报告工程实践缺口 |
| [`codex-efficient-engineering`](skills/codex-efficient-engineering/SKILL.md) | 需要优化 Codex Chat、Plan mode、Local/Worktree、compaction 或 Fast Mode 的使用方式 | 在不削弱验证与授权边界的前提下，降低不必要的 Context、等待和 credit 消耗 |

### ChatGPT 内容与工作区管理

| Skill | 适用场景 | 核心结果 |
| --- | --- | --- |
| [`chatgpt-history-organizer`](skills/chatgpt-history-organizer/SKILL.md) | 审计或整理指定范围的 ChatGPT 网页聊天、修复标题、全量归类或复核既有整理结果 | 按已授权动作核验标题和项目归属，检查共享状态与移动资格，并报告范围内完成情况和未解决项 |

### 图像创作与摄影策划

| Skill | 适用场景 | 核心结果 |
| --- | --- | --- |
| [`staged-candid-character-photographer`](skills/staged-candid-character-photographer/SKILL.md) | 为成年虚构角色制作真人 COS 或二次元图片，逐项设置场景、着装、动作、表情、写实程度与镜头 | 汇总已选参数，调用可用工具生成并检查图片；支持只交付完整提示词，明确工具不可用或部分失败时的完成范围 |

## 如何选择

- 要为一个代码仓库建立或更新长期项目指引：使用 `$agent-project-bootstrap`。
- 要决定一个软件工程任务如何在 Codex 中拆分、规划、隔离或节省额度：使用 `$codex-efficient-engineering`。
- 要整理 ChatGPT 网页中的历史聊天、标题和项目：使用 `$chatgpt-history-organizer`。
- 要从角色名开始策划摄影参数，并生成图片或完整提示词：使用 `$staged-candid-character-photographer`。

这些 Skill 分别覆盖仓库 onboarding、Codex workflow 决策、ChatGPT 内容管理和角色摄影。普通实现、调试、测试或代码评审不会仅因发生在 Codex 中就自动触发前两个 Skill；角色百科与剧情问答也不会触发摄影流程。

## 使用方式

将需要的 Skill 目录安装或链接到 Agent 的 Skills 目录。支持自动发现的 Agent 会根据 `SKILL.md` frontmatter 中的 `name` 和 `description` 判断是否加载；也可以显式调用：

```text
使用 $agent-project-bootstrap 审计并接入这个仓库，创建或完善 AGENTS.md。

使用 $codex-efficient-engineering 判断这个任务应继续当前 Chat、启用 Plan mode，还是放到 Worktree 中执行。

使用 $chatgpt-history-organizer 全量整理我的 ChatGPT 聊天记录，修正标题并归入合适项目。

使用 $staged-candid-character-photographer 为约尔·福杰制作图片，先引导我设置参数。
```

显式调用后只需补充目标、操作范围和特殊约束，不必重复 Skill 已经定义的完整流程。

## 仓库结构

```text
skills/
└── <skill-name>/
    ├── SKILL.md
    ├── agents/
    │   └── openai.yaml
    ├── references/
    ├── examples/
    ├── scripts/
    └── assets/
```

只有 `SKILL.md` 是必需文件。其他目录按实际收益添加：

- `agents/openai.yaml`：Codex UI 展示信息和调用策略。
- `references/`：只在特定模式下读取的详细流程、协议或领域资料。
- `examples/`：帮助理解调用方式、跨轮交互和预期行为的示例。
- `scripts/`：需要稳定复用和独立验证的确定性操作。
- `assets/`：生成结果会复制或改造的模板、图片等资源。

## 设计原则

- Skill 名称和触发描述应准确区分适用与排除场景，避免吸引无关任务。
- `SKILL.md` 只保留会改变 Agent 决策的目标、约束和核心 workflow；条件化细节放入按需引用的资源。
- 访问能力不等于写入授权。外部修改、提交、推送、删除、发布或发送仍需遵守当前任务的授权范围。
- 完成标准必须可验证；不能把命令成功、局部处理或当前可见视图外推为全量结果。
- 根据真实任务和已验证失败小步修订，不把一次性提示、临时状态或通用常识堆进 Skill。

## 验证与维护

新增或修改 Skill 后，定位当前环境中 Skill Creator 提供的 `scripts/quick_validate.py`，确认 Python 和 `PyYAML` 可用，再对每个 Skill 执行校验。该脚本由 Skill Creator 提供，不随本仓库分发；将以下路径替换为实际位置：

```text
python -X utf8 <skill-creator>/scripts/quick_validate.py skills/<skill-name>
```

校验器检查 frontmatter、`name` 格式和未完成占位符；还需独立核对 `name` 与父目录名称一致、相对引用存在，以及 `agents/openai.yaml` 的字段和 Skill 对应。不要把校验器通过表述为这些补充检查或工作流验证已经完成。

工作流修改应以隔离样本验证决策和验收结果。例如聊天整理需覆盖仅改名、只读复核、共享项目、不可移动聊天、已归错项目、分页期间更新及长对话分支；项目指引需覆盖自定义发现根。核对实际动作和未解决项是否符合请求，不以匹配文案代替行为验证。涉及真实账号或新会话的验证受环境与授权限制时，明确报告尚未验证的行为。
