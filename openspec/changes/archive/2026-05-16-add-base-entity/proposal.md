## Why

当前项目中的实体分散定义了基础字段（如 `id`、`createdAt`、`updatedAt`），缺乏统一的规范和复用机制。这导致：
- 每个实体都需要重复定义相同的基础字段
- 字段命名和类型可能不一致
- 缺乏软删除（`deletedAt`）支持
- 维护成本高，修改基础字段需要改动所有实体

需要引入 `BaseEntity` 抽象类，统一管理所有实体的基础字段，提高代码复用性和一致性。

## What Changes

- 创建 `BaseEntity` 抽象类，定义通用基础字段（`id`、`createdAt`、`updatedAt`、`deletedAt`）
- 重构所有现有实体（`UserEntity`、`JobEntity`、`ResumeEntity`、`JobApplicationEntity`）继承 `BaseEntity`
- 移除各实体中重复的基础字段定义
- 创建 migration 更新数据库表结构，添加 `deletedAt` 字段
- 更新 MikroORM 配置，注册 `BaseEntity`

## Capabilities

### New Capabilities
- `base-entity`: 统一的实体基础字段管理能力，包括主键、时间戳和软删除字段

### Modified Capabilities
- `mikroorm-postgresql-persistence`: 修改实体定义方式，所有实体继承 `BaseEntity`
- `database-migration-management`: 新增 migration 添加 `deletedAt` 字段

## Impact

**代码影响：**
- 新增 `src/common/entities/base.entity.ts` 文件
- 修改所有实体文件：`UserEntity`、`JobEntity`、`ResumeEntity`、`JobApplicationEntity`
- 新增 migration 文件添加 `deletedAt` 字段
- 更新 `mikro-orm.config.ts` 注册 `BaseEntity`

**数据库影响：**
- 所有表添加 `deleted_at` 列（可为空的 timestamptz）
- 现有数据的 `deleted_at` 默认为 NULL

**API 影响：**
- 无破坏性变更
- 实体 ID 类型可能从 UUID 变为 number（取决于配置）
