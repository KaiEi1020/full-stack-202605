## Why

当前后端仍是 NestJS 默认脚手架结构，数据访问、领域建模与 API 边界都较为薄弱，难以支撑后续业务扩展。现在将后端改造成 Prisma + DDD + GraphQL，可以尽早统一数据持久化方式、明确领域边界，并把对外接口收敛到更适合前端按需查询的模型。

## What Changes

- 引入 Prisma，建立后端数据库 schema、Prisma Client 与基础持久化工作流。
- 在后端同时支持 DDD 分层方式与普通 Nest service 方式，并按业务复杂度选择实现模式。
- 将现有用户相关能力迁移到 Prisma + GraphQL，并定义复杂业务采用 DDD、简单 CRUD 采用普通 service 的边界。
- 为后端提供 GraphQL 查询接口，并以 GraphQL resolver 作为主要读取入口。
- **BREAKING**：后端内部模块结构、数据访问方式与对外 API 组织方式将发生明显调整。

## Capabilities

### New Capabilities
- `backend-architecture`: 定义后端采用 Prisma 后，同时支持 DDD 分层与普通 service 两种实现模式的架构约束
- `graphql-api`: 定义后端 GraphQL 接口、查询入口与响应行为
- `persistence-model`: 定义基于 Prisma 的数据持久化模型与仓储访问能力

### Modified Capabilities
- `user-management`: 将现有用户查询能力迁移到 Prisma + GraphQL 架构下，并明确其应采用 DDD 还是普通 service 的实现边界

## Impact

- 影响 `backend/` 下的模块组织、启动配置、依赖注入关系与测试结构
- 可能新增 Prisma 相关依赖、配置文件、schema 与生成产物
- 影响现有用户查询实现以及 REST/GraphQL 并存或迁移策略
- 影响前端或其他调用方未来接入后端数据的方式
