---
title: Phase 0 Project Skeleton
status: accepted
phase: Phase 0
tags:
  - project
  - spec
---

# Phase 0 项目骨架

## 目标

新开发者可以从干净仓库安装依赖、启动 MySQL、执行迁移、启动前后端，并通过 Swagger 和健康检查验证基础请求链路。

## 范围

- Vue 3 + Vite 前端外壳
- NestJS API
- MySQL Docker Compose
- Prisma schema 与初始 migration
- 环境变量示例、Swagger、DTO Validation、requestId 和错误格式
- 启动与验证文档

## 本次不做

注册登录、组织 CRUD、项目 CRUD、任务 CRUD、权限管理、Redis、RabbitMQ、附件和部署。

## 验收标准

- [ ] `pnpm install` 成功
- [ ] `pnpm db:up` 启动 MySQL
- [ ] `pnpm db:migrate` 应用 migration
- [ ] `pnpm dev` 启动前后端
- [ ] `/api/health` 返回 200 和 `x-request-id`
- [ ] Swagger 页面可打开
- [ ] `pnpm lint`、`pnpm test`、`pnpm build` 通过
