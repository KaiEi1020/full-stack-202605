## MODIFIED Requirements

### Requirement: 后端必须通过分层模块装配用户查询能力
系统 MUST 在当前实现中根据模块复杂度，通过 REST 控制器、应用服务、领域边界、基础设施实现或直接 CRUD 服务装配后端能力。

#### Scenario: 装配复杂模块
- **WHEN** 后端应用启动并装配具有明确领域规则的模块
- **THEN** 系统必须允许该模块通过 controller、应用服务与仓储实现协作完成业务流程

#### Scenario: 装配简单模块
- **WHEN** 后端应用启动并装配以资源操作为主的简单模块
- **THEN** 系统必须允许该模块通过 controller、service 与 TypeORM Repository 直接协作完成 CRUD 能力

### Requirement: 后端模块依赖方向必须保持单向分层
系统 MUST 保证复杂模块中的依赖方向清晰，并统一通过 TypeORM 访问持久化数据；简单模块 MUST 保持控制器到服务到持久化访问的单向依赖。

#### Scenario: 执行复杂模块请求
- **WHEN** REST 控制器处理复杂模块请求
- **THEN** 控制器必须调用应用层服务，并由基础设施层提供具体的数据访问实现

#### Scenario: 执行简单模块请求
- **WHEN** REST 控制器处理简单模块资源请求
- **THEN** 控制器必须调用服务层，并由服务层通过 TypeORM Repository 完成数据访问
