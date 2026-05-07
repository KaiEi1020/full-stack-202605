## ADDED Requirements

### Requirement: 后端必须通过分层模块装配用户查询能力
系统 MUST 在当前实现中通过接口层、应用层、基础设施层协作装配用户查询能力。

#### Scenario: 装配用户查询模块
- **WHEN** 后端应用启动并装配用户查询能力
- **THEN** 系统必须允许该模块通过 resolver、查询服务与仓储实现协作完成查询

### Requirement: 后端模块依赖方向必须保持单向分层
系统 MUST 保证用户查询链路中的依赖方向清晰，并统一通过 Prisma 访问持久化数据。

#### Scenario: 执行用户查询
- **WHEN** GraphQL resolver 处理用户查询请求
- **THEN** resolver 必须调用应用层查询服务，并由基础设施层提供具体的数据访问实现
