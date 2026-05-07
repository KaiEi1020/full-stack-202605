## ADDED Requirements

### Requirement: 后端必须通过 GraphQL 暴露用户查询接口
系统 MUST 提供 GraphQL 查询入口以支持读取用户列表和单个用户详情。

#### Scenario: 查询用户列表
- **WHEN** 客户端执行用户列表 GraphQL query
- **THEN** 系统必须返回由用户对象组成的结果集合

#### Scenario: 查询单个用户
- **WHEN** 客户端使用用户 id 执行单用户 GraphQL query
- **THEN** 系统必须返回对应用户对象或空结果

### Requirement: GraphQL 接口必须通过查询服务接入后端能力
系统 MUST 让 GraphQL resolver 作为协议适配层，并通过查询服务接入后端查询能力。

#### Scenario: Resolver 处理用户列表查询
- **WHEN** GraphQL resolver 收到 `users` 查询请求
- **THEN** resolver 必须调用查询服务返回用户列表，而不是直接依赖 Prisma Client 或内存数据

#### Scenario: Resolver 处理单用户查询
- **WHEN** GraphQL resolver 收到 `user` 查询请求
- **THEN** resolver 必须调用查询服务返回对应用户或空结果
