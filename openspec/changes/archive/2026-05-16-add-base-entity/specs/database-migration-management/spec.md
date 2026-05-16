## ADDED Requirements

### Requirement: Migration 必须添加 deletedAt 字段
系统 MUST 创建 migration 为所有现有表添加 `deletedAt` 字段。

#### Scenario: 添加 deletedAt 字段
- **WHEN** 执行 migration
- **THEN** 系统 MUST 为所有表添加 `deleted_at` 列（可为空的 timestamptz）

#### Scenario: 现有数据保持不变
- **WHEN** migration 执行完成
- **THEN** 现有数据的 `deleted_at` 字段 MUST 为 NULL
