## MODIFIED Requirements

### Requirement: 后端必须使用 MikroORM + PostgreSQL 作为持久化框架
系统 MUST 使用 MikroORM 及其 PostgreSQL 驱动管理所有数据库连接、实体映射与数据访问，并通过 `@mikro-orm/nestjs` 完成与 NestJS 的集成。

#### Scenario: 应用启动时初始化数据库
- **WHEN** Nest 应用启动
- **THEN** 系统 MUST 通过 MikroORM 建立与 PostgreSQL 的连接，解析 `DATABASE_URL`，并加载所有已注册的实体

#### Scenario: 实体变更后使用 Migration 管理 Schema
- **WHEN** 应用启动且实体定义与现有表结构不一致
- **THEN** 系统 MUST 不自动调整 schema，而是通过 MikroORM Migrations 显式管理 schema 变更

#### Scenario: Migration 配置必须正确
- **WHEN** 开发者查看 MikroORM 配置文件
- **THEN** 配置 MUST 指定 migrations 目录路径、命名规范和执行策略

## REMOVED Requirements

### Requirement: 实体变更后自动同步 schema
**Reason**: 自动 schema 同步仅适用于开发环境，无法追踪变更历史、不支持回滚、不适合生产环境。已全面迁移至 MikroORM Migrations 实现版本化的 schema 管理。
**Migration**: 使用 `pnpm migration:create` 创建 migration，使用 `pnpm migration:up` 执行 migration，使用 `pnpm migration:down` 回滚 migration。
