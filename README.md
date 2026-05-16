# full-stack-202605

一个前后端分离的全栈项目，包含 React 19 + Vite 前端、NestJS 11 后端，以及基于 Docker Compose 的本地/远端运行方案。

## 技术栈

| 层 | 技术 |
| --- | --- |
| 前端 | React 19 + Vite + Tailwind CSS 4 |
| 后端 | NestJS 11 |
| 数据访问 | MikroORM + PostgreSQL |
| 语言 | TypeScript |
| 包管理 | pnpm |
| 运行与部署 | Docker + Docker Compose |

## 仓库结构

```text
.
├── frontend/              # React + Vite 前端应用
├── backend/               # NestJS 后端应用
├── scripts/               # 打包、传输、远端启动脚本
├── openspec/              # OpenSpec 规格与变更记录
├── dist-deploy/           # 部署产物输出目录
├── docker-compose.yml     # 部署/整体验证使用的 compose
├── docker-compose.local.yml
└── deploy-cvm.sh
```

## 项目说明

该仓库包含两个独立管理的 Node/TypeScript 应用：

- `frontend/`：单页前端应用
- `backend/`：HTTP API

依赖需要分别在各自目录中安装；根目录保留了聚合脚本，但不使用 root workspace 安装依赖。

## 环境要求

| 工具 | 建议版本 |
| --- | --- |
| Node.js | 20+ |
| pnpm | 10+ |
| Docker | 最新稳定版 |
| Docker Compose Plugin | 最新稳定版 |

## 快速开始

### 1. 安装依赖

```bash
cd frontend && pnpm install
cd ../backend && pnpm install
```

### 2. 启动本地 PostgreSQL

```bash
docker compose -f docker-compose.local.yml up -d
```

本地数据库默认映射 `5432:5432`，数据持久化到 `./postgres/local-data`。

### 3. 启动前端开发环境

```bash
cd frontend && pnpm dev
```

### 4. 启动后端开发环境

```bash
cd backend && pnpm start:dev
```

后端默认监听 `process.env.PORT ?? 3000`，并通过 `DATABASE_URL` 连接 PostgreSQL。

## 常用命令

### frontend/

| 操作 | 命令 |
| --- | --- |
| 安装依赖 | `cd frontend && pnpm install` |
| 启动开发服务 | `cd frontend && pnpm dev` |
| 生产构建 | `cd frontend && pnpm build` |
| 代码检查 | `cd frontend && pnpm lint` |
| 预览构建结果 | `cd frontend && pnpm preview` |

### backend/

| 操作 | 命令 |
| --- | --- |
| 安装依赖 | `cd backend && pnpm install` |
| 启动开发服务 | `cd backend && pnpm start:dev` |
| 启动一次 | `cd backend && pnpm start` |
| 生产构建 | `cd backend && pnpm build` |
| 代码检查 | `cd backend && pnpm lint` |
| 格式化 | `cd backend && pnpm format` |
| 单元测试 | `cd backend && pnpm test` |
| 监听测试 | `cd backend && pnpm test:watch` |
| 覆盖率测试 | `cd backend && pnpm test:cov` |
| E2E 测试 | `cd backend && pnpm test:e2e` |
| 调试测试 | `cd backend && pnpm test:debug` |
| 重置数据库提示 | `cd backend && pnpm db:reset` |

## 根目录脚本

根目录保留了一些聚合脚本，便于同时操作两个应用：

| 操作 | 命令 |
| --- | --- |
| 启动前端开发 | `pnpm dev:frontend` |
| 启动后端开发 | `pnpm dev:backend` |
| 构建全部 | `pnpm build` |
| 检查全部 | `pnpm lint` |
| 运行后端测试 | `pnpm test` |
| 打包部署文件 | `pnpm deploy:cvm:pack` |
| 传输到远端 | `pnpm deploy:cvm:transfer` |
| 打包并传输 | `pnpm deploy:cvm` |

## 后端运行配置

`docker-compose.yml` 中后端与数据库相关配置如下：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `NODE_ENV` | `production` | 运行环境 |
| `PORT` | `3000` | 后端监听端口 |
| `DATABASE_USER` | `postgres` | PostgreSQL 用户名 |
| `DATABASE_PASSWORD` | 空 | PostgreSQL 密码 |
| `DATABASE_NAME` | `app_db` | PostgreSQL 数据库名 |
| `DATABASE_URL` | `postgresql://...` | 后端数据库连接串 |
| `STORAGE_DIR` | `/app/storage` | 文件存储目录 |
| `BIGMODEL_API_KEY` | 空 | 大模型接口密钥 |
| `BIGMODEL_MODEL` | `glm-4.5-air` | 大模型名称 |

## Docker 运行

### 本地开发数据库

```bash
docker compose -f docker-compose.local.yml up -d
```

### 整体启动

确保根目录存在可用的 `.env` 文件后执行：

```bash
docker compose up -d
```

常用命令：

| 操作 | 命令 |
| --- | --- |
| 启动服务 | `docker compose up -d` |
| 停止服务 | `docker compose down` |
| 重启容器 | `docker compose restart` |
| 强制重建并启动 | `docker compose up -d --force-recreate` |
| 查看状态 | `docker compose ps` |
| 查看日志 | `docker compose logs -f backend frontend db` |

## OpenSpec 事实来源

当前实现与需求变更以 `openspec/specs/` 下的主规格为准；`openspec/changes/archive/` 仅保留历史变更记录，不再作为当前事实来源。

与本次 README 同步的主规格包括：

| 主题 | 事实来源 |
| --- | --- |
| 本地 PostgreSQL compose | `openspec/specs/local-postgresql-compose/spec.md` |
| 部署 PostgreSQL compose | `openspec/specs/postgresql-docker-service/spec.md` |
| MikroORM + PostgreSQL 持久化 | `openspec/specs/mikroorm-postgresql-persistence/spec.md` |
| 持久化模型规范 | `openspec/specs/persistence-model/spec.md` |

## 远程部署

### 1. 打包镜像与部署文件

```bash
node scripts/pack-cvm.mjs
```

产物会输出到 `dist-deploy/`。

### 2. 传输到远端服务器

```bash
node scripts/transfer-cvm.mjs --host <host> --user <user> [--key <key-path>]
```

也可以使用封装脚本：

```bash
bash ./deploy-cvm.sh transfer --host <host> --user <user> [--key <key-path>]
```

### 3. 一键打包并传输

```bash
bash ./deploy-cvm.sh all --host <host> --user <user> [--key <key-path>]
```

### 4. 远端启动

```bash
cd ~/resume-app && sudo ./start-remote.sh
```

## 远端服务器准备

安装 Docker 与 Compose 插件：

```bash
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## 日志
```bash
cd ~/resume-app && sudo docker compose ps && sudo docker compose logs --tail=100 backend frontend
```

如果需要手动处理镜像：

| 操作 | 命令 |
| --- | --- |
| 解压前端镜像 | `gunzip -f frontend.tar.gz` |
| 解压后端镜像 | `gunzip -f backend.tar.gz` |
| 加载前端镜像 | `docker load -i frontend.tar` |
| 加载后端镜像 | `docker load -i backend.tar` |
| 启动服务 | `docker compose up -d` |

## 说明

- 前端当前是单页应用，主要入口在 `frontend/src/App.tsx`
- 后端当前基于标准 NestJS 启动方式，入口在 `backend/src/main.ts`
- 后端 lint 命令带 `--fix`，执行时会直接修改文件
