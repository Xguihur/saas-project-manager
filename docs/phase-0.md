---
title: Phase 0 本地使用指南
phase: Phase 0
status: active
tags:
  - project
  - phase-0
  - runbook
---

# Phase 0 本地使用指南

启动顺序：Docker → MySQL → 数据库迁移 → 前后端。

当前只需要 MySQL、NestJS 后端和 Vue 前端，不需要 Redis 等其他服务。Phase 0 提供系统状态页面和数据库骨架，尚未实现注册、登录和业务增删改查。

## 1. 准备环境并进入项目

需要 Node.js 22、pnpm 11（项目指定 11.5.2）、OrbStack 或 Docker Desktop。

先打开 OrbStack 或 Docker Desktop，等待启动完成，再在终端执行：

```bash
cd /Users/xiaolongxia/Desktop/2026-RUSH/project/saas-project-manager
docker info
```

项目位置不同时替换上述路径。`docker info` 能显示服务端信息，说明 Docker 已就绪。下面的命令都在项目根目录执行。

## 2. 准备配置并安装依赖（首次使用）

```bash
test -f .env || cp .env.example .env
test -f backend/.env || cp backend/.env.example backend/.env
test -f frontend/.env || cp frontend/.env.example frontend/.env
pnpm install --frozen-lockfile
```

前三行只创建缺失的配置，不覆盖已有配置。安装命令会安装前后端依赖，并通过后端的 `postinstall` 脚本生成 Prisma Client。以后依赖变化时再重新安装。

| 文件 | 作用 |
| --- | --- |
| `.env` | MySQL 容器的账号、密码和数据库名 |
| `backend/.env` | 后端端口和数据库连接地址 |
| `frontend/.env` | 前端 API 路径，默认 `/api` |

## 3. 启动 MySQL

```bash
pnpm db:up
docker compose ps
```

作用：在后台启动数据库。等待 `mysql` 状态变为 `healthy`；若仍为 `starting`，稍后再次执行 `docker compose ps`。

需要查看数据库日志时运行 `pnpm db:logs`，按 `Ctrl + C` 退出日志查看，数据库仍在后台运行。

## 4. 应用数据库迁移

```bash
pnpm db:deploy
```

作用：执行项目已经提交的迁移。首次运行会创建 `users`、`organizations`、`organization_members`、`projects`、`tasks` 五张业务表及迁移记录表。

可以重复执行，已应用的迁移不会重复执行。以后拉取到新迁移时，也运行这个命令。

## 5. 启动前后端并验证

```bash
pnpm dev
```

作用：同时启动后端和前端，保持终端运行。这个命令不启动数据库。

| 地址 | 用途 / 成功标志 |
| --- | --- |
| http://localhost:5173 | 前端页面，显示“API 正常” |
| http://localhost:3000/api/health | 后端健康检查，返回 `"status": "ok"` |
| http://localhost:3000/docs | Swagger 接口文档 |

开发时，前端的 `/api` 请求由 Vite 代理到后端 `http://localhost:3000`。健康检查接口本身不查询数据库；数据库可用性还需结合容器状态和迁移执行结果判断。

如果要分别看日志，可改为在两个终端中进入项目根目录，分别执行 `pnpm dev:backend` 和 `pnpm dev:frontend`，与 `pnpm dev` 二选一。

## 6. 查看数据库（可选）

另开一个终端，进入项目根目录后执行：

```bash
pnpm db:studio
```

作用：启动 Prisma Studio，通常自动打开 http://localhost:5555，以终端显示的地址为准。它可以查看、筛选、新增、修改和删除数据库记录。

Studio 根据 `backend/prisma/schema.prisma` 识别模型，并使用 `backend/.env` 中的 `DATABASE_URL` 连接 MySQL。只要依赖、配置和数据库就绪，即可使用，无需启动项目的前后端。

请求路径：浏览器 → 本地 Studio 服务 → MySQL。数据保存在 MySQL 中，Studio 中保存的修改会影响真实数据库，不经过 NestJS 的业务校验。使用完后在 Studio 终端按 `Ctrl + C` 关闭服务。

也可以使用 Navicat 连接同一个数据库：

| 参数 | 默认配置 |
| --- | --- |
| 主机 / 端口 | `127.0.0.1:3307`（容器内部是 `3306`） |
| 数据库 / 用户名 | `saas_project_manager` / `saas_app` |
| 密码 | 查看根目录 `.env` 中的 `MYSQL_PASSWORD` |

Studio 适合按项目模型快速查看和编辑数据；Navicat 适合编写 SQL、管理表结构和索引、导入导出等完整数据库管理操作。两者连接同一个库时，刷新后会看到相同的数据。

## 以后每天启动

先打开 OrbStack 或 Docker Desktop，进入项目根目录：

```bash
pnpm db:up
docker compose ps
```

确认 MySQL 为 `healthy` 后执行 `pnpm dev`。有新迁移时，在启动前执行 `pnpm db:deploy`。

## 停止项目

- 前后端：在运行终端按 `Ctrl + C`；分别启动时分别停止。
- Studio：在它的终端按 `Ctrl + C`；仅关闭浏览器不会停止服务。
- 数据库：执行 `pnpm db:down`，已有数据会保留。不要加 `-v`，该参数会删除数据库数据卷。

## Prisma 中几个工具的分工

| 名称 | 在项目中的作用 |
| --- | --- |
| Schema | `backend/prisma/schema.prisma` 描述模型、字段及关联 |
| Client | 生成供 TypeScript 后端调用的数据库访问代码 |
| Migrate | 用迁移文件创建和更新数据库表结构 |
| Studio | 在浏览器中查看和编辑数据库记录 |

MySQL 负责存数据，Prisma 提供操作数据库的工具。只启动项目用 `pnpm db:deploy`；开发时修改 Schema、需要生成新迁移才用 `pnpm db:migrate`，它会使用影子数据库校验迁移（参见 [数据模型说明](data-model.md)）。

## 常见问题

| 现象 | 处理 |
| --- | --- |
| Docker 连接失败 / 找不到 `docker.sock` | 启动当前 Docker 上下文对应的 OrbStack 或 Docker Desktop，再运行 `docker info` |
| Prisma 连接数据库失败 | 确认 MySQL 为 `healthy`，并核对 `backend/.env` 中的账号、密码、库名和端口 `3307` |
| 修改 `.env` 后数据库密码不变 | 已有数据卷不会因环境变量改变而自动更新账号；需使用原凭据连接后修改数据库账号，并同步配置 |
| 前端显示“连接失败” | 查看后端终端日志，检查健康接口；修改后端端口时同步设置 `frontend/.env` 的 `VITE_DEV_API_URL`，然后重启前端 |
| 端口占用 | 用 `lsof -nP -iTCP:端口号 -sTCP:LISTEN` 查占用；修改数据库映射端口时同步修改后端两个数据库 URL |

需要检查代码时可另行执行 `pnpm lint`、`pnpm test`、`pnpm build`，它们不是日常启动的必需步骤。
