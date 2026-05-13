## MODIFIED Requirements

### Requirement: 后端必须通过分层模块装配用户查询能力
系统 MUST 在当前实现中根据模块复杂度，通过 REST 控制器、应用服务、领域边界、基础设施实现或直接 CRUD 服务装配后端能力。在单体应用顶层结构中，业务模块 MUST 归入 `src/modules/`，系统级支撑模块 MUST 归入 `src/core/`；业务实体 MUST 默认归属拥有其生命周期和写入规则的 feature module，而不是长期集中放在 `src/core/database/`。

#### Scenario: 装配复杂模块
- **WHEN** 后端应用启动并装配具有明确领域规则的模块
- **THEN** 系统必须允许该模块通过 controller、应用服务、领域边界与基础设施实现协作完成业务流程，并将该模块放置在 `src/modules/` 下

#### Scenario: 装配简单模块
- **WHEN** 后端应用启动并装配以资源操作为主的简单模块
- **THEN** 系统必须允许该模块通过 controller、service 与 TypeORM Repository 直接协作完成 CRUD 能力，并将该模块放置在 `src/modules/` 下

#### Scenario: 放置业务实体
- **WHEN** 后端新增或迁移具体业务实体
- **THEN** 系统必须将该实体放置在 owning feature 下，并允许其他模块通过装配或依赖边界访问它

### Requirement: 后端模块依赖方向必须保持单向分层
系统 MUST 保证复杂模块中的依赖方向清晰，并统一通过 TypeORM 访问持久化数据；简单模块 MUST 保持控制器到服务到持久化访问的单向依赖。系统级基础设施能力 MUST 作为被业务模块依赖的支撑模块组织在 `src/core/` 下，而不是与业务模块并列混放；`src/core/database/` MUST 保留数据库基础设施职责，而不是承担所有业务实体的长期归属。

#### Scenario: 执行复杂模块请求
- **WHEN** REST 控制器处理复杂模块请求
- **THEN** 控制器必须调用应用层服务，并由基础设施层提供具体的数据访问实现

#### Scenario: 执行简单模块请求
- **WHEN** REST 控制器处理简单模块资源请求
- **THEN** 控制器必须调用服务层，并由服务层通过 TypeORM Repository 完成数据访问

#### Scenario: 引入系统级基础设施能力
- **WHEN** 后端应用新增数据库、存储、PDF、消息推送或模型接入等系统级能力
- **THEN** 系统必须将这些能力组织在 `src/core/` 下，并允许业务模块单向依赖它们

#### Scenario: 注册迁移后的实体
- **WHEN** 业务实体已迁移到各自 feature module
- **THEN** 系统必须仍然能够通过数据库基础设施层统一注册这些实体并完成应用启动
