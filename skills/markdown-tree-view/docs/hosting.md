# 网页托管与 Cloudflare 统计

生成的 HTML 可直接离线打开，也可作为静态页面托管。默认 CSP 只允许随文件内嵌的阅读脚本、样式与图标，不允许联网加载脚本或发送请求。

## Cloudflare Web Analytics

网站已启用 Cloudflare Web Analytics 时，Cloudflare 可能在响应中注入 `static.cloudflareinsights.com/beacon.min.js`，包括带版本路径的形式。默认离线 CSP 会阻止该脚本并产生控制台错误；只允许脚本还不足以允许统计上报。

需要保留网站统计时，在已安装的 Skill 目录内执行以下命令；将输入和输出替换为实际路径：

```sh
node scripts/markdown-tree-view.mjs --input input.md --output output.html --allow-cloudflare-analytics
node scripts/markdown-tree-view.mjs --input input.md --output output.html --allow-cloudflare-analytics --check
```

此选项允许 `https://static.cloudflareinsights.com` 的脚本，以及同源和 `https://cloudflareinsights.com` 的连接。页面自身的脚本仍通过 SHA-256 校验，其他脚本来源及任意内联脚本继续受限；`Referrer-Policy` 改为 `strict-origin`，使 `Referer` 请求头只发送源站，不包含页面路径或查询参数。此限制不约束统计脚本的上报内容。生成器不会添加统计脚本、token 或主动网络请求。脚本由托管方注入后，可以执行并上报该网站的统计数据。

自动注入通常向同源 `/cdn-cgi/rum` 上报，手动嵌入向 `https://cloudflareinsights.com/cdn-cgi/rum` 上报；具体要求见 [Cloudflare Web Analytics FAQ](https://developers.cloudflare.com/web-analytics/faq/#what-do-i-need-to-add-to-my-content-security-policy-csp)。

重新生成后，需要将新的 HTML 部署到原网站，再检查实际响应与控制台。若服务器另有 CSP 响应头，它与 HTML 中的 CSP 会同时生效，必须分别允许所需来源；一个宽松策略不能覆盖另一个严格策略，参阅 [多重 CSP 的执行规则](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy#multiple_content_security_policies)。`--check` 使用与生成时相同的选项，否则会报告输出不一致。

不需要统计时，保留默认生成方式，并在托管平台关闭该页面或站点的 Web Analytics 注入，参阅 [Cloudflare 配置选项](https://developers.cloudflare.com/web-analytics/configuration-options/)。修改生成器不会改变网站设置，也不会更新此前生成或部署的 HTML。

### 验证范围

本地 HTTP 模拟可检查 CSP 是否允许脚本和上报路径，但不能证明线上 token、域名、CORS、服务器响应头或注入配置正确。广告拦截器、网络失败或其他托管脚本仍可能产生各自的错误，应按实际诊断处理。
