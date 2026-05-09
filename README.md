# full-stack-202605

一个前后端分离的全栈项目模板，包含 React 19 + Vite 前端和 NestJS 11 后端，并提供基于 Docker 的远程部署脚本。

## 技术栈

| 层 | 技术 |
| --- | --- |
| 前端 | React 19 + Vite |
| 后端 | NestJS 11 + GraphQL |
| 数据访问 | Prisma + SQLite |
| 语言 | TypeScript |
| 包管理 | pnpm |
| 部署 | Docker + Docker Compose |

## 仓库结构

```text
.
├── frontend/       # React + Vite 前端应用
├── backend/        # NestJS 后端应用
├── scripts/        # 打包、传输、远端启动脚本
├── dist-deploy/    # 部署产物输出目录
├── docker-compose.yml
└── deploy-cvm.sh
```

## 项目说明

该仓库包含两个独立管理的 Node/TypeScript 应用：

- `frontend/`：单页前端应用
- `backend/`：HTTP API 与 GraphQL 服务

依赖需要分别在各自目录中安装，不使用根目录 pnpm workspace。

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

### 2. 启动前端开发环境

```bash
cd frontend && pnpm dev
```

### 3. 启动后端开发环境

```bash
cd backend && pnpm start:dev
```

后端默认监听 `process.env.PORT ?? 3000`。

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

## 根目录脚本

虽然前后端独立安装依赖，但根目录保留了一些便捷脚本：

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

`docker-compose.yml` 中后端支持以下环境变量：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `NODE_ENV` | `production` | 运行环境 |
| `PORT` | `3000` | 后端监听端口 |
| `DATABASE_URL` | `file:/app/data/dev.db` | SQLite 数据库地址 |
| `STORAGE_DIR` | `/app/storage` | 文件存储目录 |
| `GRAPHQL_SCHEMA_PATH` | `/app/schema.gql` | GraphQL schema 输出路径 |
| `BIGMODEL_API_KEY` | 空 | 大模型接口密钥 |
| `BIGMODEL_MODEL` | `glm-4.5-air` | 大模型名称 |

## Docker 本地运行

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
| 查看日志 | `docker compose logs -f backend frontend` |

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
