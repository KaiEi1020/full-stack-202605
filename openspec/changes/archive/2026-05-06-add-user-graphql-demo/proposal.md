## Why

当前后端仅提供一个简单的 REST 示例接口，前端也没有与后端集成的数据访问页面，无法展示项目在真实业务场景下的模块化后端能力与前后端联调方式。现在补充用户模块、GraphQL 接口和前端调用示例，可以为后续功能开发提供统一的演示基础与扩展入口。

## What Changes

- 在后端新增 `user` 模块，提供基础用户数据模型与查询能力。
- 在后端引入 GraphQL，并暴露用户查询接口作为示例。
- 在前端新增一个 GraphQL 调用页面，用于请求并展示用户数据。
- 在前端引入 Apollo Client，作为 GraphQL 请求与状态管理入口。
- 在前端新增路由系统，使 GraphQL demo 通过独立页面入口访问。
- 补充前后端集成所需的最小配置，使两个独立应用可以在本地完成演示联调。

## Capabilities

### New Capabilities
- `user-management`: 定义后端用户模块的基础数据访问与用户查询能力。
- `graphql-api`: 定义后端 GraphQL 服务与用户查询 schema 能力。
- `graphql-demo-page`: 定义前端 GraphQL 示例页面的数据获取与展示能力。

### Modified Capabilities

## Impact

- 后端 `backend/` 将新增 NestJS 用户模块与 GraphQL 相关依赖、配置和解析器。
- 前端 `frontend/` 将新增页面逻辑、路由配置、Apollo Client 初始化与 GraphQL 请求代码，可能调整 `App.tsx` 与样式文件。
- 本地运行方式将扩展为前端调用后端 GraphQL 接口的联调流程。
- 项目依赖将增加 GraphQL 运行时及 NestJS GraphQL 集成相关包。
