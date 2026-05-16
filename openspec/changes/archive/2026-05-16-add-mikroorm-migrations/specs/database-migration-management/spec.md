## ADDED Requirements

### Requirement: 系统必须提供 MikroORM Migrations CLI 工具链
系统 MUST 安装并配置 MikroORM Migrations CLI，提供完整的数据库 schema 版本化管理能力。

#### Scenario: 安装 Migrations 依赖
- **WHEN** 开发者安装项目依赖
- **THEN** 系统 MUST 包含 `@mikro-orm/migrations` 包及其依赖

#### Scenario: 配置 Migrations 目录
- **WHEN** 开发者查看 MikroORM 配置文件
- **THEN** 配置 MUST 指定 `migrations` 目录路径为 `./migrations`

#### Scenario: 配置 Migrations 命名规范
- **WHEN** 开发者创建新的 migration
- **THEN** 系统 MUST 使用时间戳命名格式 `{timestamp}-{name}.ts`

### Requirement: 系统必须提供 Migration 创建能力
系统 MUST 允许开发者基于实体变更自动生成 migration 文件。

#### Scenario: 创建初始 Migration
- **WHEN** 开发者执行 `pnpm migration:create --initial`
- **THEN** 系统 MUST 生成包含所有现有实体表结构的初始 migration 文件

#### Scenario: 创建增量 Migration
- **WHEN** 开发者修改实体定义后执行 `pnpm migration:create`
- **THEN** 系统 MUST 检测实体与数据库 schema 的差异并生成对应的 migration 文件

#### Scenario: Migration 文件内容验证
- **WHEN** Migration 文件生成后
- **THEN** 文件 MUST 包含 `up()` 方法执行 schema 变更和 `down()` 方法回滚变更

### Requirement: 系统必须提供 Migration 执行能力
系统 MUST 允许开发者执行 pending migrations 更新数据库 schema。

#### Scenario: 执行所有 Pending Migrations
- **WHEN** 开发者执行 `pnpm migration:up`
- **THEN** 系统 MUST 按顺序执行所有未执行的 migration 文件

#### Scenario: 执行指定 Migration
- **WHEN** 开发者执行 `pnpm migration:up --name <migration-name>`
- **THEN** 系统 MUST 仅执行指定的 migration 文件

#### Scenario: Migration 执行事务保护
- **WHEN** Migration 执行过程中发生错误
- **THEN** 系统 MUST 回滚当前 migration 的所有变更

### Requirement: 系统必须提供 Migration 回滚能力
系统 MUST 允许开发者回滚已执行的 migrations。

#### Scenario: 回滚最近一个 Migration
- **WHEN** 开发者执行 `pnpm migration:down`
- **THEN** 系统 MUST 回滚最近执行的 migration

#### Scenario: 回滚指定 Migration
- **WHEN** 开发者执行 `pnpm migration:down --name <migration-name>`
- **THEN** 系统 MUST 回滚指定的 migration 及其之后的所有 migrations

#### Scenario: 回滚所有 Migrations
- **WHEN** 开发者执行 `pnpm migration:down --to 0`
- **THEN** 系统 MUST 回滚所有已执行的 migrations

### Requirement: 系统必须提供 Migration 状态查看能力
系统 MUST 允许开发者查看 migrations 的执行状态。

#### Scenario: 查看 Migration 列表
- **WHEN** 开发者执行 `pnpm migration:status`
- **THEN** 系统 MUST 显示所有 migration 文件及其执行状态（已执行/待执行）

#### Scenario: 查看 Pending Migrations
- **WHEN** 存在未执行的 migrations
- **THEN** 系统 MUST 在状态列表中明确标记 pending migrations

### Requirement: 系统必须提供数据库重置能力
系统 MUST 允许开发者重置数据库到初始状态。

#### Scenario: 重置数据库
- **WHEN** 开发者执行 `pnpm migration:fresh`
- **THEN** 系统 MUST 删除所有表并重新执行所有 migrations

#### Scenario: 重置数据库并保留 Migration 历史
- **WHEN** 开发者执行 `pnpm migration:fresh`
- **THEN** 系统 MUST 清空数据但保留 migration 执行记录

### Requirement: Migration 文件必须纳入版本控制
系统 MUST 将所有 migration 文件提交到 Git 仓库。

#### Scenario: Migration 文件提交
- **WHEN** 开发者创建新的 migration 文件
- **THEN** 文件 MUST 被添加到 Git 版本控制

#### Scenario: Migration 文件审查
- **WHEN** 开发者提交包含 migration 文件的 PR
- **THEN** 审查者 MUST 检查 migration 内容的正确性和安全性
