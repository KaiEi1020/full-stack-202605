## Context

当前项目使用 MikroORM + PostgreSQL，包含 4 个实体：
- `UserEntity`（用户表）
- `JobEntity`（职位表）
- `ResumeEntity`（简历表）
- `JobApplicationEntity`（职位投递表）

现有实体各自定义了 `id`、`createdAt`、`updatedAt` 字段，但缺乏统一的基类管理。用户希望引入 `BaseEntity` 抽象类，统一管理基础字段，并添加软删除支持。

## Goals / Non-Goals

**Goals:**
- 创建 `BaseEntity` 抽象类，统一管理基础字段
- 重构所有实体继承 `BaseEntity`
- 添加软删除（`deletedAt`）字段支持
- 保持现有数据兼容性
- 提供清晰的 migration 路径

**Non-Goals:**
- 不实现软删除的自动过滤（需要在查询时手动过滤）
- 不修改现有业务逻辑
- 不改变现有 API 接口

## Decisions

### 1. ID 类型选择

**决策：** 使用 `number` 类型自增主键，而非 UUID。

**理由：**
- 性能更好：自增主键比 UUID 索引性能更优
- 存储更小：`BIGINT` 占 8 字节，UUID 占 16 字节
- 更易调试：数字 ID 更易读和记忆
- 符合用户提供的 BaseEntity 定义

**备选方案：**
- UUID：全局唯一，适合分布式系统，但性能较差
- 保持现有 UUID：不统一，维护成本高

### 2. BaseEntity 文件位置

**决策：** 放置在 `src/common/entities/base.entity.ts`。

**理由：**
- `common` 目录用于存放跨模块复用的通用代码
- `entities` 子目录明确表示这是实体相关的通用代码
- 符合项目的 DDD 分层架构

**备选方案：**
- `src/core/entities/`：core 用于框架级能力，BaseEntity 更偏向业务通用
- `src/modules/shared/entities/`：增加目录层级，不如 common 直观

### 3. 软删除实现方式

**决策：** 使用 `deletedAt` 字段（可为空的 timestamptz），不自动过滤已删除记录。

**理由：**
- 简单直观：通过 `deletedAt` 是否为 NULL 判断是否删除
- 灵活性高：业务代码可以自行决定是否过滤
- 不影响现有查询：避免隐式过滤导致的意外行为

**备选方案：**
- 使用 MikroORM 的 `filter` 自动过滤：隐式行为，可能导致意外
- 使用 `isDeleted` 布尔字段：无法记录删除时间

### 4. Migration 策略

**决策：** 创建新的 migration 添加 `deletedAt` 字段，不修改现有数据。

**理由：**
- 安全：不删除或修改现有数据
- 可回滚：可以随时删除 `deletedAt` 字段
- 渐进式：现有数据保持不变，新数据自动填充

### 5. 实体重构策略

**决策：** 分步重构，先创建 BaseEntity，再逐个修改实体。

**理由：**
- 降低风险：每个实体的修改可以独立测试
- 易于审查：每个变更清晰可见
- 可回滚：如果出现问题，可以快速回滚单个实体

## Risks / Trade-offs

**风险 1：ID 类型变更导致现有数据不兼容**
- **影响：** 现有实体使用 UUID，改为自增主键会导致数据丢失
- **缓解措施：**
  - 保持现有实体的 UUID 类型不变
  - 新实体使用自增主键
  - 或者：为 BaseEntity 支持泛型，允许 ID 类型可配置

**风险 2：Migration 执行失败**
- **影响：** 数据库处于不一致状态
- **缓解措施：**
  - Migration 使用事务
  - 执行前备份数据库
  - 提供回滚 migration

**风险 3：软删除查询遗漏**
- **影响：** 业务代码忘记过滤已删除记录，导致数据泄露
- **缓解措施：**
  - 在文档中明确说明需要手动过滤
  - 提供 Repository 辅助方法简化过滤逻辑

**权衡：**
- **优点：** 统一管理、代码复用、易于维护、支持软删除
- **缺点：** 需要修改所有实体、需要创建 migration、可能影响现有数据

## Migration Plan

### 阶段 1：创建 BaseEntity

1. 创建 `src/common/entities/base.entity.ts`
2. 定义基础字段：`id`、`createdAt`、`updatedAt`、`deletedAt`
3. 更新 `mikro-orm.config.ts` 注册 BaseEntity

### 阶段 2：重构实体

1. 修改 `UserEntity` 继承 BaseEntity
2. 修改 `JobEntity` 继承 BaseEntity
3. 修改 `ResumeEntity` 继承 BaseEntity
4. 修改 `JobApplicationEntity` 继承 BaseEntity
5. 移除各实体中重复的基础字段

### 阶段 3：创建 Migration

1. 创建 migration 添加 `deletedAt` 字段
2. 执行 migration
3. 验证数据库结构

### 阶段 4：测试与验证

1. 运行单元测试
2. 运行集成测试
3. 验证应用启动正常
4. 验证 CRUD 操作正常

### 回滚策略

如果出现问题：
1. 回滚 migration：删除 `deletedAt` 字段
2. 恢复实体代码：移除 BaseEntity 继承
3. 删除 `BaseEntity` 文件

## Open Questions

1. **是否需要支持 ID 类型可配置？**
   - 当前设计使用自增主键，但现有实体使用 UUID
   - 是否需要为 BaseEntity 支持泛型，允许 ID 类型可配置？

2. **是否需要自动过滤已删除记录？**
   - 当前设计需要手动过滤，是否需要提供 Repository 辅助方法？

3. **是否需要添加其他基础字段？**
   - 如 `createdBy`、`updatedBy` 等审计字段
