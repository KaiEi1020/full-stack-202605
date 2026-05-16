## Why

当前后端使用 SQLite + TypeORM 技术栈，存在三方面问题：（1）SQLite 在并发访问、数据完整性及团队协作场景下存在局限，需要迁移到 PostgreSQL；（2）TypeORM 的 `sql.js` 驱动维护不足、装饰器冗长，MikroORM 的类型安全与 Data Mapper 模式更适合 DDD 实践；（3）infrastructure 层目录结构不统一——recruitment 模块的实体散落在 `domain/entity/`，且缺乏仓储抽象，应用层直接依赖 `@InjectRepository`。需要一次统一重构：切换数据库为 PostgreSQL、迁移 ORM 为 MikroORM、统一 infrastructure 目录为 `persistence/entities` + `repositories`。

## What Changes

- **BREAKING**: 将后端数据库从 SQLite 迁移至 PostgreSQL，包括 ORM 配置、连接方式、实体类型映射及环境变量调整。
- **BREAKING**: 将后端 ORM 从 TypeORM 迁移至 MikroORM，包括所有实体装饰器、仓储实现及 NestJS 模块配置。
- 统一所有模块的 infrastructure 层目录结构为 `infrastructure/persistence/entities/`（MikroORM 实体）和 `infrastructure/repositories/`（仓储实现）。
- 将 recruitment 模块中位于 `domain/entity/` 的 TypeORM 实体迁移至 `infrastructure/persistence/entities/`，并改为 MikroORM 装饰器。
- 将 user 模块中 `typeorm-user.repository.ts` 重构为 MikroORM 实现并迁移至 `infrastructure/repositories/`。
- 为 recruitment 模块定义仓储接口（`domain/` 下），在 `infrastructure/repositories/` 中提供 MikroORM 实现，消除应用层对 ORM 的直接依赖。
- 更新 `docker-compose.yml`：移除 mysql 服务，增加 PostgreSQL 15+ 数据库服务，并调整后端服务的环境变量与依赖关系。
- 新增 `docker-compose.local.yml`：仅包含 PostgreSQL 服务，用于开发者在本地快速启动独立的数据库容器。
- 更新 `.env` 与 `backend/.env`：引入 `DATABASE_URL`（PostgreSQL 连接串），移除 `SQLITE_DATABASE_PATH`。
- 更新测试配置：E2E 与单元测试适配 MikroORM + PostgreSQL。

## Capabilities

### New Capabilities
- `postgresql-docker-service`: 在 `docker-compose.yml` 中定义生产/部署环境的 PostgreSQL 服务，包含持久化卷、健康检查与资源限制。
- `local-postgresql-compose`: 提供 `docker-compose.local.yml` 供开发者本地独立启动 PostgreSQL 容器。
- `mikroorm-postgresql-persistence`: 后端 MikroORM 配置适配 PostgreSQL，包括连接串解析、驱动切换、实体类型映射与 NestJS 模块集成。
- `recruitment-mikroorm-repositories`: 招聘领域（Job、Resume、JobApplication）实体迁移至 `infrastructure/persistence/entities/`，仓储接口与 MikroORM 实现位于 `infrastructure/repositories/`。
- `user-mikroorm-repository`: 用户模块实体迁移至 MikroORM 装饰器，仓储实现重构并迁移至 `infrastructure/repositories/`。

### Modified Capabilities
- `persistence-model`: 持久化模型规范从 TypeORM + SQLite 更新为 MikroORM + PostgreSQL。
- `recruitment-layered-architecture`: 招聘分层架构中的 `infrastructure` 层目录结构明确为 `persistence/entities` 与 `repositories` 子目录。

## Impact

- **依赖变更**：移除 `@nestjs/typeorm`、`typeorm`、`sql.js`；新增 `@mikro-orm/core`、`@mikro-orm/postgresql`、`@mikro-orm/nestjs`、`pg`。
- **数据迁移**：现有 SQLite 数据文件需导出并导入到 PostgreSQL，或允许在新环境中重新初始化 schema。
- **部署影响**：`docker-compose.yml` 的服务定义变化，运维人员需重新拉取镜像并启动 PostgreSQL 容器。
- **目录重构**：recruitment 模块 `domain/entity/` 删除，实体移至 `infrastructure/persistence/entities/`；user 模块仓储文件迁移至 `infrastructure/repositories/`。
- **开发体验**：开发者可通过 `docker-compose -f docker-compose.local.yml up -d` 快速启动本地 PostgreSQL。
