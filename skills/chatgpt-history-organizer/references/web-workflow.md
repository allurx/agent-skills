# ChatGPT 网页批量核验参考

仅在普通网页操作无法高效完成全量目录或验证时读取。本页记录的是一次成功任务中观察到的同源请求形状，不是公开稳定 API；ChatGPT 更新后可能失效。

## 安全边界

- 先通过正常网页登录，并使用当前页面同源会话。
- 从当前网页实际网络请求确认 URL、HTTP 方法、请求体和响应字段；不要凭本页盲写。
- 不打印、复制、持久化或回传 `authorization`、Cookie、会话令牌及其他凭据。
- 用稳定聊天 ID 跟踪进度。每次写入后重新 GET 验证，不依据 HTTP 200 单独判定成功。

## 已观察到的请求形状

全局聊天目录曾使用：

```text
GET /backend-api/conversations?offset={offset}&limit=100&order=updated
```

必须递增 `offset` 继续请求，直到后续页不再返回新 ID。响应中的 `total` 曾与可分页取得的实际数量不一致，因此不能仅凭 `total` 提前终止。

单条聊天详情曾使用：

```text
GET /backend-api/conversation/{conversation_id}?include_has_versions=true&num_turns=100
```

从 `mapping` 中按 `message.author.role == "user"` 提取真实用户消息。`num_turns` 的可用上限曾为 100。

标题更新曾使用：

```text
POST /backend-api/conversation/id/{conversation_id}/rename
Content-Type: application/json

{"title":"新的准确标题"}
```

项目移动曾使用：

```text
PATCH /backend-api/conversation/{conversation_id}
Content-Type: application/json

{"gizmo_id":"目标项目 ID"}
```

仅发送 `conversation_template_id` 曾返回成功但实际项目字段未更新，所以必须核验详情中的 `gizmo_id` 和 `conversation_template_id`。这一差异尤其说明不能相信成功响应本身。

项目内聊天目录曾使用：

```text
GET /backend-api/gizmos/{project_id}/conversations?cursor={cursor}
```

按响应 cursor 分页，直至没有下一页。

## 全量验收不变量

- 所有分页结果按聊天 ID 合并后没有重复计数。
- 所有目标范围内、非临时且未归档的普通聊天都有非空项目 ID。
- 本轮每个改名 ID 的当前标题与预期完全一致。
- 本轮每个移动 ID 的当前项目 ID 与预期完全一致。
- 刷新侧栏后没有独立未归类聊天残留。

若数据核验与界面显示矛盾，应刷新并重新读取；仍矛盾时报告差异，不宣布完成。
