## REMOVED Requirements

### Requirement: 后端必须暴露 GraphQL 端点
**Reason**: 项目决定统一使用 RESTful HTTP 接口，不再维护 GraphQL 协议入口。
**Migration**: 所有原有查询与变更能力必须迁移到对应的 REST 资源路径与 HTTP 方法。

### Requirement: 后端必须支持查询全部用户
**Reason**: 面向资源的 REST 接口将替代 GraphQL 查询字段作为读取入口。
**Migration**: 将用户列表查询迁移为对应资源集合的 GET 接口。

### Requirement: 后端必须支持按 id 查询单个用户
**Reason**: 单资源查询将通过 REST 路径参数表达，而不是 GraphQL query。
**Migration**: 将单用户查询迁移为对应资源的 GET /:id 接口。

### Requirement: 后端必须通过 GraphQL 暴露用户查询接口
**Reason**: GraphQL 协议层已被 REST 控制器取代。
**Migration**: 将查询与注册等操作迁移为 REST 控制器中的资源接口。

### Requirement: GraphQL 接口必须通过查询服务接入后端能力
**Reason**: Resolver 不再作为协议适配层存在，新的协议适配层为 REST 控制器。
**Migration**: 将 resolver 到服务的接入关系替换为 controller 到服务的接入关系。
