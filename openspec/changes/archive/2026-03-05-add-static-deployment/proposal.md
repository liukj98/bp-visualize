# Change: 添加静态站点部署支持

## Why
项目当前仅支持本地开发运行，无法供他人在线访问。用户没有自己的服务器和域名，需要一个零成本、零运维的部署方案，将 Vite 构建产物发布为可公开访问的静态站点。

## What Changes
- **部署目标**：使用 EdgeOne Pages 部署静态站点，自动分配公网域名，无需自备服务器/域名
- **构建配置**：确认 Vite 构建输出目录 (`dist/`) 符合部署要求，配置 `base` 路径
- **部署流程**：通过 CodeBuddy 集成的 EdgeOne Pages 功能一键部署

## Impact
- Affected specs: `static-deployment`（新建）
- Affected code:
  - `vite.config.js` — 可能需要配置 `base` 路径以适配部署环境
- 不涉及业务逻辑或功能变更，仅新增部署能力
