## MODIFIED Requirements

### Requirement: 后端必须使用 MikroORM + PostgreSQL 作为持久化框架
系统 MUST 使用 MikroORM 及其 PostgreSQL 驱动管理所有数据库连接、实体映射与数据访问，并通过 `@mikro-orm/nestjs` 完成与 NestJS 的集成。

#### Scenario: 应用启动时初始化数据库
- **WHEN** Nest 应用启动
- **THEN** 系统 MUST 通过 MikroORM 建立与 PostgreSQL 的连接，解析 `DATABASE_URL`，并加载所有已注册的实体

#### Scenario: 实体继承 BaseEntity
- **WHEN** 定义新的实体类
- **THEN** 系统 MUST 允许实体继承 `BaseEntity` 以获得统一的基础字段

#### Scenario: Migration 配置必须正确
- **WHEN** 开发者查看 MikroORM 配置文件
- **THEN** 配置 MUST 指定 migrations 目录路径、命名规范和执行策略
- **AND** 配置 MUST 注册 `BaseEntity` 到实体列表
