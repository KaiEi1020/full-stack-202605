## Why

当前项目使用 MikroORM 的自动 schema 同步（`schemaGenerator.update()`）来管理数据库表结构，这种方式仅适用于开发环境，存在以下问题：
- 无法追踪数据库变更历史
- 生产环境无法安全地执行 schema 变更
- 缺乏变更的可回滚能力
- 团队协作时无法同步数据库变更

需要引入 MikroORM Migrations 机制，提供版本化的数据库 schema 管理，确保开发、测试、生产环境的一致性和安全性。

## What Changes

- 引入 MikroORM Migrations CLI 工具和配置
- 创建初始 migration 文件，记录当前所有实体的表结构
- 配置 MikroORM 使用 migrations 而非自动 schema 同步
- 提供 migration 相关的 npm scripts（创建、执行、回滚）
- 更新开发、测试、生产环境的数据库初始化流程
- 移除开发环境的自动 schema 同步配置

## Capabilities

### New Capabilities
- `database-migration-management`: 数据库 schema 版本化管理能力，包括创建 migration、执行 migration、回滚 migration、查看 migration 状态

### Modified Capabilities
- `mikroorm-postgresql-persistence`: 修改 schema 管理方式，从自动同步改为 migrations，确保生产环境安全

## Impact

**代码影响：**
- `backend/package.json`: 添加 MikroORM Migrations CLI 依赖和相关 npm scripts
- `backend/mikro-orm.config.ts` 或 `backend/src/core/database/mikro-orm.config.ts`: 配置 migrations 路径和策略
- `backend/src/app.module.ts`: 移除 schema 自动同步逻辑
- 新增 `backend/migrations/` 目录存放 migration 文件

**流程影响：**
- 开发者修改实体后需要创建并执行 migration
- 部署流程需要包含 migration 执行步骤
- 生产环境部署前需要审查 migration 内容

**环境影响：**
- 所有环境（开发、测试、生产）统一使用 migrations
- 数据库用户需要具备执行 DDL 语句的权限
