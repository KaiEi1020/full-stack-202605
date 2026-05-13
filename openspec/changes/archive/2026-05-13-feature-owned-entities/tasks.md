## 1. 明确实体归属与目录结构

- [x] 1.1 确认 `UserEntity` 的 owning feature，并迁移到 `modules/user/` 下的持久化目录
- [x] 1.2 确认 `ResumeEntity` 与 `JobRequirementEntity` 的 owning feature，并迁移到对应模块下的实体目录
- [x] 1.3 在简单 CRUD 模块与复杂 DDD 模块中分别落地约定的实体目录结构

## 2. 调整数据库基础设施与模块引用

- [x] 2.1 更新 `core/database/typeorm.config.ts`，改为注册来自各 feature 的实体
- [x] 2.2 收缩 `core/database/index.ts` 和相关导出，避免继续把所有业务实体集中暴露在数据库目录
- [x] 2.3 修复各 feature module、service、repository 对迁移后实体的引用路径

## 3. 验证与回归

- [x] 3.1 运行 `cd backend && pnpm build`，确认实体迁移后编译通过
- [x] 3.2 运行 `cd backend && pnpm test`，确认实体迁移后测试通过
- [x] 3.3 启动后端应用并验证模块装配、依赖注入和实体注册正常
