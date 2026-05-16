## 1. 创建 BaseEntity

- [x] 1.1 创建 `src/common/entities/base.entity.ts` 文件
- [x] 1.2 定义 `BaseEntity` 抽象类，包含 `id`、`createdAt`、`updatedAt`、`deletedAt` 字段
- [x] 1.3 配置 `@PrimaryKey` 装饰器（自增主键）
- [x] 1.4 配置 `@Property` 装饰器（时间戳字段）
- [x] 1.5 配置 `deletedAt` 字段（可为空的 timestamptz）
- [x] 1.6 更新 `mikro-orm.config.ts`，注册 `BaseEntity` 到实体列表

## 2. 重构实体

- [x] 2.1 修改 `UserEntity` 继承 `BaseEntity`
- [x] 2.2 移除 `UserEntity` 中重复的基础字段（`id`、`createdAt`、`updatedAt`）
- [x] 2.3 修改 `JobEntity` 继承 `BaseEntity`
- [x] 2.4 移除 `JobEntity` 中重复的基础字段
- [x] 2.5 修改 `ResumeEntity` 继承 `BaseEntity`
- [x] 2.6 移除 `ResumeEntity` 中重复的基础字段
- [x] 2.7 修改 `JobApplicationEntity` 继承 `BaseEntity`
- [x] 2.8 移除 `JobApplicationEntity` 中重复的基础字段

## 3. 创建 Migration

- [x] 3.1 运行 `pnpm migration:create` 创建新的 migration
- [x] 3.2 审查生成的 migration 文件，确认添加 `deletedAt` 字段
- [x] 3.3 执行 migration：`pnpm migration:up`
- [x] 3.4 验证数据库表结构已更新

## 4. 测试与验证

- [x] 4.1 运行 `pnpm lint` 修复代码风格问题
- [x] 4.2 运行 `pnpm test` 确认测试通过
- [x] 4.3 运行 `pnpm build` 确认构建成功
- [x] 4.4 启动应用验证实体正常工作
- [x] 4.5 测试实体的 CRUD 操作
- [x] 4.6 验证时间戳字段自动填充
- [x] 4.7 验证软删除功能

## 5. 文档更新

- [x] 5.1 更新 `backend/README.md`，添加 `BaseEntity` 使用说明
- [x] 5.2 添加实体继承 `BaseEntity` 的示例代码
- [x] 5.3 说明软删除的使用方式
