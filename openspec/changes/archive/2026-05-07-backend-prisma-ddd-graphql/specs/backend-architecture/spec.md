## ADDED Requirements

### Requirement: 后端必须同时支持 DDD 分层方式与普通 service 方式
系统 MUST 在引入 Prisma 后，同时支持复杂业务采用 DDD 分层实现、简单 CRUD 采用普通 Nest service 实现。

#### Scenario: 装配复杂业务模块
- **WHEN** 后端应用启动并装配复杂业务能力
- **THEN** 系统必须允许该模块通过领域层、应用层、基础设施层与接口层协作完成实现

#### Scenario: 装配简单 CRUD 模块
- **WHEN** 后端应用启动并装配简单 CRUD 能力
- **THEN** 系统必须允许该模块使用普通 Nest service 方式实现，而不强制引入完整 DDD 分层

### Requirement: 后端模块依赖方向必须与实现模式匹配
系统 MUST 保证不同实现模式下的依赖边界清晰，并统一通过 Prisma 访问持久化数据。

#### Scenario: 执行复杂业务查询
- **WHEN** GraphQL resolver 处理复杂业务查询请求
- **THEN** resolver 必须通过应用层调用领域定义的能力，并由基础设施层提供具体的数据访问实现

#### Scenario: 执行简单 CRUD 查询
- **WHEN** GraphQL resolver 处理简单 CRUD 查询请求
- **THEN** resolver 可以直接调用普通 service 完成查询，但该 service 仍必须通过 Prisma 访问数据
