## ADDED Requirements

### Requirement: 后端必须通过 GraphQL 暴露用户查询接口
系统 MUST 提供 GraphQL 查询入口以支持读取用户列表和单个用户详情。

#### Scenario: 查询用户列表
- **WHEN** 客户端执行用户列表 GraphQL query
- **THEN** 系统必须返回由用户对象组成的结果集合

#### Scenario: 查询单个用户
- **WHEN** 客户端使用用户 id 执行单用户 GraphQL query
- **THEN** 系统必须返回对应用户对象或空结果

### Requirement: GraphQL 接口必须按业务复杂度接入后端能力
系统 MUST 让 GraphQL resolver 作为协议适配层，并根据业务复杂度接入应用层/领域层或普通 service 层。

#### Scenario: Resolver 处理复杂业务查询
- **WHEN** GraphQL resolver 收到复杂业务查询请求
- **THEN** resolver 必须调用应用层用例完成查询，而不是直接依赖 Prisma Client 或内存数据

#### Scenario: Resolver 处理简单 CRUD 查询
- **WHEN** GraphQL resolver 收到简单 CRUD 查询请求
- **THEN** resolver 可以调用普通 service 完成查询，但不得直接在 resolver 中拼接 Prisma 访问逻辑
