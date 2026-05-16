## 1. 依赖安装与配置

- [x] 1.1 安装 MikroORM Migrations 依赖：`@mikro-orm/migrations`
- [x] 1.2 创建 `backend/migrations/` 目录
- [x] 1.3 配置 MikroORM migrations 设置（路径、命名规范）
- [x] 1.4 添加 npm scripts：`migration:create`、`migration:up`、`migration:down`、`migration:status`、`migration:fresh`
- [x] 1.5 更新 `pnpm-lock.yaml`，确认依赖树干净

## 2. 创建初始 Migration

- [x] 2.1 备份现有数据库（如有数据）
- [x] 2.2 清空数据库或创建新的测试数据库
- [x] 2.3 运行 `pnpm migration:create --initial` 生成初始 schema migration
- [x] 2.4 审查生成的 migration 文件，确认表结构正确
- [x] 2.5 执行初始 migration：`pnpm migration:up`
- [x] 2.6 验证数据库表结构与实体定义一致
- [x] 2.7 提交初始 migration 文件到 Git

## 3. 移除自动 Schema 同步

- [x] 3.1 移除 `app.module.ts` 或相关配置文件中的 schema 自动同步逻辑
- [x] 3.2 确认应用启动时不再执行 `schemaGenerator.update()`
- [x] 3.3 验证应用启动不会自动修改数据库 schema

## 4. Migration 工作流测试

- [x] 4.1 测试创建 migration：修改实体并运行 `pnpm migration:create`
- [x] 4.2 审查生成的 migration 文件内容
- [x] 4.3 测试执行 migration：`pnpm migration:up`
- [x] 4.4 验证数据库 schema 已更新
- [x] 4.5 测试回滚 migration：`pnpm migration:down`
- [x] 4.6 验证数据库 schema 已回滚
- [x] 4.7 测试查看 migration 状态：`pnpm migration:status`
- [x] 4.8 测试重置数据库：`pnpm migration:fresh`

## 5. 文档更新

- [x] 5.1 更新 `backend/README.md`，添加 Migration 使用说明
- [x] 5.2 创建 Migration 工作流文档（创建、执行、回滚、状态查看）
- [x] 5.3 更新开发文档，说明修改实体后需要创建 migration
- [x] 5.4 添加 Migration 最佳实践说明（命名、审查、提交）

## 6. 部署流程更新

- [x] 6.1 更新部署文档，添加 migration 执行步骤
- [x] 6.2 确认生产环境数据库用户具备 DDL 权限
- [x] 6.3 配置 CI/CD 流程执行 migrations（可选）
- [x] 6.4 测试在测试环境执行 migrations

## 7. 验证与收尾

- [x] 7.1 运行 `pnpm lint` 修复代码风格问题
- [x] 7.2 运行 `pnpm test` 确认测试通过
- [x] 7.3 在本地环境完整测试 migration 工作流
- [x] 7.4 清理残留的自动 schema 同步相关代码和注释
- [x] 7.5 确认所有 migration 文件已提交到 Git
