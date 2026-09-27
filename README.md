---
title: SaaS Project Manager
status: active
---

# SaaS Project Manager

这是一个面向小团队的企业项目管理 SaaS 学习项目。它从一个模块化单体开始，围绕真实的协作场景逐步演进：用户注册登录、组织与成员、项目、任务、权限、评论，以及后续的附件、通知、限流、部署和监控。

项目的目的不是堆叠技术名词，而是完整走一遍从需求、领域模型、数据库、API、前端页面到测试、部署和故障排查的工程链路。最终代码会作为全栈开发学习过程和作品集的一部分。

## 技术栈

- 前端：Vue 3、TypeScript、Vite、Vue Router、Pinia、Element Plus
- 后端：NestJS、TypeScript、Prisma
- 数据库：MySQL 8.0
- 本地基础设施：Docker Compose
- API：REST、Swagger/OpenAPI
- 当前架构：模块化单体，前后端分离

Redis、RabbitMQ、对象存储、CI/CD 和 Kubernetes 会在实际需求对应的阶段加入，不在 Phase 0 预先引入。

## 当前进度

当前为 **Phase 0：项目准备与骨架**，目标是让另一台电脑可以按文档启动相同系统，并理解一次请求如何经过前端、API、校验、日志和数据库。

已包含：

- Vue 前端应用外壳和真实健康检查页面
- NestJS API、`GET /api/health`、Swagger、DTO 校验和统一错误格式
- `requestId` 请求追踪和基础请求日志
- User、Organization、OrganizationMember、Project、Task 的 Prisma 数据模型
- MySQL Docker Compose 和初始 migration
- Phase 0 的启动、迁移、验证文档

## 快速开始

### 1. 环境要求

- Node.js 22（见 `.nvmrc`）
- pnpm 11
- Docker Desktop 或 OrbStack，并确保 Docker daemon 正在运行

### 2. 安装并配置

```bash
corepack enable
pnpm install
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. 启动 MySQL 并执行迁移

```bash
pnpm db:up
pnpm db:migrate
```

首次执行迁移会创建 Prisma migration history 和 Phase 0 的五张核心表。后续在已有 migration 的环境使用 `pnpm db:deploy`。

### 4. 启动前后端

```bash
pnpm dev
```

- 前端：http://localhost:5173
- API：http://localhost:3000/api/health
- Swagger：http://localhost:3000/docs

### 5. 验证

```bash
pnpm lint
pnpm test
pnpm build
curl -i http://localhost:3000/api/health
```

完整步骤、环境变量说明、故障排查和验收清单见 [`docs/phase-0.md`](docs/phase-0.md)。后续每个阶段的启动和验证说明继续沉淀在 `docs/` 目录。

## 仓库结构

```text
.
├── backend/       # NestJS API、Prisma schema 和 migrations
├── frontend/      # Vue 3 SPA
├── docs/          # 阶段文档、数据模型和 Feature Spec
├── compose.yaml   # 当前只运行 MySQL
└── README.md
```

业务代码按领域模块组织。前端页面和业务组件放在 `frontend/src/modules`，后端 Controller、Service、DTO 放在 `backend/src/modules`。通用抽象只有在出现稳定重复后再提取。

## 开发约定

每个功能先写 `docs/specs/` 中的 Feature Spec，再实现、测试和验收。API 契约以 Swagger 为准；所有组织资源都必须在后端校验成员关系和资源归属；真实密钥和 `.env` 不提交 Git。

长期路线见项目规划笔记，仓库中的文档记录与当前代码一致的可执行方法。
