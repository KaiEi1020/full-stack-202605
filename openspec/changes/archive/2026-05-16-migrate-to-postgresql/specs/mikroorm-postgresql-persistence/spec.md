## ADDED Requirements

### Requirement: 后端必须使用 MikroORM + PostgreSQL 作为持久化框架
系统 MUST 使用 MikroORM 及其 PostgreSQL 驱动管理所有数据库连接、实体映射与数据访问，并通过 `@mikro-orm/nestjs` 完成与 NestJS 的集成。

#### Scenario: 应用启动时初始化数据库
- **WHEN** Nest 应用启动
- **THEN** 系统 MUST 通过 MikroORM 建立与 PostgreSQL 的连接，解析 `DATABASE_URL`，并加载所有已注册的实体

#### Scenario: 实体变更后自动同步 schema
- **WHEN** 应用启动且实体定义与现有表结构不一致
- **THEN** 系统 MUST 自动调整 PostgreSQL schema 以匹配实体定义（开发环境）

### Requirement: MikroORM 必须通过官方 NestJS 模块集成
系统 MUST 使用 `@mikro-orm/nestjs` 提供的 `MikroOrmModule` 完成全局与模块级的 ORM 注册。

#### Scenario: 全局注册 MikroORM
- **WHEN** 开发者在 `AppModule` 中导入 ORM 模块
- **THEN** 系统 MUST 提供 `MikroOrmModule.forRoot()` 或 `forRootAsync()` 配置，包含 `DATABASE_URL`、实体列表与调试开关

#### Scenario: 模块级注册实体
- **WHEN** 功能模块（如 UserModule、RecruitmentModule）需要访问特定实体
- **THEN** 系统 MUST 允许通过 `MikroOrmModule.forFeature([EntityA, EntityB])` 注册实体

### Requirement: 实体类型映射必须适配 MikroORM + PostgreSQL
系统 MUST 确保所有数据库实体从 TypeORM 装饰器迁移至 MikroORM 装饰器，并在 PostgreSQL 下的类型映射正确。

#### Scenario: 字符串主键映射
- **WHEN** 系统定义使用 UUID 字符串的主键实体
- **THEN** 对应字段 MUST 使用 MikroORM 的 `@PrimaryKey()` 装饰器，映射为 PostgreSQL 的 `uuid` 或 `varchar(36)`

#### Scenario: 日期时间字段映射
- **WHEN** 系统定义包含创建时间、更新时间的实体
- **THEN** 对应字段 MUST 使用 `@CreatedAt()` / `@UpdatedAt()` 或 `@Property({ type: 'timestamptz' })`

#### Scenario: JSON 数据存储
- **WHEN** 实体中存在 JSON 序列化字段（如 `requiredSkillsJson`、`educationJson`）
- **THEN** 系统 MUST 确保这些字段在 PostgreSQL 中可正常存储为 `text`，且读取反序列化行为不变

### Requirement: 环境变量配置必须统一更新
系统 MUST 更新项目根目录 `.env` 与 `backend/.env`，移除 TypeORM 与 SQLite 相关变量，引入 MikroORM + PostgreSQL 连接配置，且数据库密码 MUST 通过环境变量管理。

#### Scenario: 配置数据库连接串
- **WHEN** 开发者查看环境变量文件
- **THEN** `DATABASE_URL` MUST 存在且格式为 `postgresql://user:password@host:port/database`，`SQLITE_DATABASE_PATH` 不应再被使用

#### Scenario: 数据库密码通过环境变量管理
- **WHEN** 开发者查看环境变量文件
- **THEN** `DATABASE_PASSWORD` MUST 存在，且 `DATABASE_URL` 中的密码部分 MUST 引用该变量值，而不是硬编码

#### Scenario: 数据库连接相关环境变量完整
- **WHEN** 开发者查看环境变量文件
- **THEN** 以下环境变量 MUST 存在：`DATABASE_URL`、`DATABASE_USER`、`DATABASE_PASSWORD`、`DATABASE_NAME`、`DATABASE_HOST`、`DATABASE_PORT`
