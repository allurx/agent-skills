---
name: chatgpt-history-organizer
description: Audit and organize all regular ChatGPT web conversations, repair inaccurate or duplicate titles from their actual content, and move every conversation into an appropriate project. Use when the user asks to classify, rename, fully organize, clear the ungrouped chat list, or verify a previous ChatGPT history cleanup. Do not use for Codex local task management.
metadata:
  short-description: Organize ChatGPT history, titles, and projects
---

# ChatGPT History Organizer

把用户指定范围内的 ChatGPT 普通聊天完整整理为可检索的项目目录。完成标准是覆盖全部历史记录、标题能反映实际内容、每条聊天项目归属合理，并通过刷新后的全量复核证明未归类聊天为零。

## Respect Scope and Authority

- 读取和审计可以直接进行；创建项目、重命名和移动聊天属于外部账号写操作，必须有用户明确授权。
- 不删除、归档、分享或发送聊天，不更改聊天正文，不把整理授权扩大为其他账号操作。
- 先确认整理的是 ChatGPT 网页“聊天”记录，而不是 Codex 本地任务或 ChatGPT“工作”任务。
- 新整理时复用含义清楚的现有项目；只有现有项目无法合理容纳一类稳定主题时才创建新项目，避免一条聊天一个项目。

## Organize the Complete History

1. 使用网页控制能力打开用户已登录的 ChatGPT，识别全部项目和普通聊天入口。
2. 建立全量目录。必须分页、持续滚动或使用等价的只读列表接口直到穷尽；不能只处理当前视口、最近记录或搜索结果。
3. 为每条聊天记录至少保存稳定 ID、当前标题和当前项目 ID。按稳定 ID 去重，不按标题去重。
4. 先处理未归类聊天。读取足以判断主题的真实用户消息；根据主要意图选择项目。跨主题聊天按最初或占主导的长期主题归类，不因末尾偶发问题随意迁移。
5. 审计标题。对含糊、自动生成失真、内容不符、截断、错别字、残留字符及同名标题读取实际内容后改名。标题应简短但可区分，优先包含对象、问题和关键技术；不要仅因出现“建议”“解析”等词就机械改名。
6. 对同名聊天逐条比较内容。如果主题或深度不同，用限定词区分；如果内容确实相同，也保留各自记录，不删除或合并。
7. 分批执行写操作并记录成功状态。发生限流时停止写入，保留已完成清单，等待冷却后从未完成 ID 继续；不要反复点击同一项。
8. 所有写操作结束后执行两类核验：
   - 数据核验：重新分页获取全量目录，确认稳定 ID 唯一、所有非临时且未归档的普通聊天均有项目 ID，并核对本轮修改后的标题和项目 ID。
   - 界面核验：刷新 ChatGPT 网页、展开侧栏，确认独立“聊天”历史区域不再显示未归类记录，项目列表仍正常。
9. 只有两类核验都通过后才能报告完成。若用户整理期间新增聊天，应把它视为新增差异，继续处理并重新核验。

## Name Conversations from Their Content

- 根据真实内容命名，不根据旧标题猜测内容。
- 保留用户能识别的技术名、产品名、类名、方法名和地域等关键词。
- 避免“新聊天”“代码”“优化建议”“问题分析”这类脱离上下文就无法检索的名称。
- 不把整段提问复制为标题，也不加入未经聊天内容支持的结论。
- 对包含医疗、财务或个人经历的聊天，在准确性和侧栏隐私之间取平衡；没有必要时不暴露过多敏感细节。

## Handle Rate Limits and Recovery

本次经验值不是产品保证，开始前应以小批量探测当前限制：

- 连续约 30–35 次侧栏移动曾触发限制；保守批量使用不超过 20 次写操作，然后预留约 120 秒冷却。
- 频繁打开多个旧聊天详情也可能触发限制。优先使用分页只读目录筛选候选，只对需判断的聊天读取正文。
- 不把“请求返回成功”当作状态已经生效；写入后重新读取目标记录核对标题和项目 ID。
- 若 UI 行为无反馈，先检查状态和错误，不盲目重复。只有在当前环境允许且已确认请求语义时，才使用同源已登录会话的接口路径。
- 任何会话凭据只保留在运行时，绝不输出、写文件或记录到 Skill 结果中。

需要通过 ChatGPT 网页内部接口提高批量核验效率时，读取 [references/web-workflow.md](references/web-workflow.md)。接口可能变化，必须先观察当前网页请求并验证字段语义。

## Report Verifiable Results

报告实际覆盖数量、唯一聊天数量、项目数量、未归类数量、标题修复数量、验证方式、限流或未验证项。不要只说“已经整理完成”，也不要把局部成功外推为全量完成。
