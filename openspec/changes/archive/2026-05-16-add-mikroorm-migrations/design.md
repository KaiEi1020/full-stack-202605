## Context

当前项目已从 TypeORM 迁移到 MikroORM + PostgreSQL，使用自动 schema 同步管理数据库表结构。现有实体包括：
- UserEntity（用户表）
- ResumeEntity（简历表）
- JobEntity（职位表）
- JobApplicationEntity（职位投递表）

当前配置在开发环境使用 `schemaGenerator.update()` 自动同步 schema，但这种方式：
- 无法追踪变更历史
- 生产环境不安全
- 无法回滚
- 团队协作困难

需要引入 MikroORM Migrations 实现版本化的 schema 管理。

## Goals / Non-Goals

**Goals:**
- 引入 MikroORM Migrations CLI 工具链
- 创建初始 migration 记录当前 schema 状态
- 配置 migrations 目录和命名规范
- 提供完整的 migration 工作流（创建、执行、回滚、状态查看）
- 确保所有环境（开发、测试、生产）使用统一的 migration 流程
- 移除自动 schema 同步配置

**Non-Goals:**
- 不处理现有数据的迁移（假设数据库为空或可重建）
- 不实现自动化的 migration 生成 CI/CD 流程
- 不处理多数据库或多 schema 的复杂场景

## Decisions

### 1. Migration 文件存放位置

**决策：** 使用 `backend/migrations/` 目录存放所有 migration 文件。

**理由：**
- 与 MikroORM 官方推荐结构一致
- 便于版本控制和代码审查
- 与源代码分离，职责清晰

**备选方案：**
- `backend/src/migrations/` - 与源代码放在一起，但不符合 MikroORM 惯例
- `backend/db/migrations/` - 更明确的语义，但增加了目录层级

### 2. Migration 命名规范

**决策：** 使用 MikroORM 默认的时间戳命名格式：`{timestamp}-{name}.ts`

**理由：**
- 时间戳确保文件名唯一
- 按时间排序，便于理解执行顺序
- MikroORM CLI 自动生成，无需手动管理

**示例：**
- `20260516120000-initial-schema.ts`
- `20260517103000-add-user-index.ts`

### 3. Migration 执行策略

**决策：** 使用 `mikro-orm migration:up` 和 `migration:down` 命令，不使用应用启动时自动执行。

**理由：**
- 显式执行更安全，避免意外变更
- 便于在生产环境前审查 migration 内容
- 支持回滚操作
- 符合生产环境最佳实践

**备选方案：**
- 应用启动时自动执行 migrations - 风险高，不适合生产环境
- 使用第三方工具（如 Flyway）- 增加复杂度，MikroORM 已提供完整功能

### 4. 开发环境 Schema 同步

**决策：** 开发环境也使用 migrations，不保留自动 schema 同步。

**理由：**
- 保持开发与生产环境一致
- 强制开发者熟悉 migration 流程
- 及早发现 migration 相关问题
- 避免开发与生产环境 schema 不一致

**备选方案：**
- 开发环境使用自动同步，生产环境使用 migrations - 会导致环境不一致，增加风险

### 5. NPM Scripts 设计

**决策：** 提供以下 npm scripts：

```json
{
  "migration:create": "mikro-orm migration:create",
  "migration:up": "mikro-orm migration:up",
  "migration:down": "mikro-orm migration:down",
  "migration:status": "mikro-orm migration:list",
  "migration:fresh": "mikro-orm migration:fresh"
}
```

**理由：**
- 覆盖完整的 migration 工作流
- 命名清晰，易于理解
- 与 MikroORM CLI 命令对应

### 6. 初始 Migration 创建

**决策：** 创建一个初始 migration 包含所有现有实体的表结构。

**理由：**
- 作为 schema 的基准版本
- 新环境可通过 migration 快速初始化
- 便于追踪后续变更

**实现方式：**
1. 清空数据库（或使用新数据库）
2. 运行 `mikro-orm migration:create --initial` 生成初始 migration
3. 审查生成的 migration 文件
4. 提交到版本控制

## Risks / Trade-offs

**风险 1：开发者忘记创建 migration**
- **影响：** 实体变更后数据库 schema 不一致
- **缓解措施：**
  - 在开发文档中明确 migration 流程
  - PR 审查时检查是否有 migration 文件
  - 提供 `migration:status` 命令检查 pending migrations

**风险 2：Migration 文件冲突**
- **影响：** 多人同时创建 migration 导致文件名冲突
- **缓解措施：**
  - 时间戳命名降低冲突概率
  - PR 审查时检查 migration 顺序
  - 合并前先拉取最新代码

**风险 3：Migration 执行失败**
- **影响：** 数据库处于不一致状态
- **缓解措施：**
  - Migration 内使用事务（MikroORM 默认支持）
  - 提供回滚命令 `migration:down`
  - 生产环境执行前先在测试环境验证
  - 数据库定期备份

**风险 4：生产环境 Migration 执行权限**
- **影响：** 数据库用户权限不足导致执行失败
- **缓解措施：**
  - 确保 production 数据库用户具备 DDL 权限
  - 在部署文档中明确权限要求
  - 部署前验证权限

**权衡：**
- **优点：** 版本化、可回滚、团队协作、生产安全
- **缺点：** 增加开发步骤、需要学习成本、可能忘记创建 migration

## Migration Plan

### 阶段 1：配置和依赖（本地开发）

1. 安装 MikroORM Migrations CLI 依赖
2. 创建 `backend/migrations/` 目录
3. 配置 MikroORM migrations 设置
4. 添加 npm scripts

### 阶段 2：创建初始 Migration

1. 备份现有数据库（如有数据）
2. 清空数据库或创建新数据库
3. 运行 `migration:create --initial` 生成初始 schema
4. 审查并提交初始 migration 文件

### 阶段 3：移除自动同步

1. 移除 `app.module.ts` 中的 schema 自动同步逻辑
2. 更新开发文档，说明 migration 流程
3. 测试 migration 工作流（创建、执行、回滚）

### 阶段 4：部署流程更新

1. 更新部署文档，添加 migration 执行步骤
2. 配置 CI/CD 流程执行 migrations
3. 生产环境部署前验证

### 回滚策略

如果 migration 方案出现问题：
1. 恢复 `app.module.ts` 中的自动 schema 同步配置
2. 删除 `migrations/` 目录
3. 移除相关依赖和 npm scripts
4. 重新使用自动 schema 同步

## Open Questions

1. **是否需要在 CI/CD 中自动执行 migrations？**
   - 当前设计为手动执行，但可以考虑在部署流程中自动化
   - 需要权衡安全性和便利性

2. **是否需要实现 migration 的自动生成？**
   - MikroORM 支持 `migration:create` 自动检测实体变更
   - 是否需要更智能的生成逻辑？

3. **多环境数据库配置如何管理？**
   - 开发、测试、生产环境的数据库连接配置
   - 是否需要环境特定的 migration 配置？
