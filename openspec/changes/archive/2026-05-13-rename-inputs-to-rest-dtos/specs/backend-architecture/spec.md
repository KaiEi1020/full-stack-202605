## MODIFIED Requirements

### Requirement: 后端必须通过分层模块装配用户查询能力
系统 MUST 在当前实现中根据模块复杂度，通过 REST 控制器、应用服务、领域边界、基础设施实现或直接 CRUD 服务装配后端能力；对于仅包含单一纯逻辑且无外部依赖的 PDF 能力，系统 MUST 允许其直接作为贴近业务 feature 的 helper 或类实现，而不强制创建独立 Nest module。在 REST 风格项目中，请求模型 MUST 使用 DTO 命名，而不是 GraphQL input 命名。

#### Scenario: 装配复杂模块
- **WHEN** 后端应用启动并装配具有明确领域规则的模块
- **THEN** 系统必须允许该模块通过 controller、应用服务与仓储实现协作完成业务流程

#### Scenario: 装配简单模块
- **WHEN** 后端应用启动并装配以资源操作为主的简单模块
- **THEN** 系统必须允许该模块通过 controller、service 与 TypeORM Repository 直接协作完成 CRUD 能力

#### Scenario: 装配单一纯逻辑 PDF 能力
- **WHEN** 后端实现仅由单一方法组成、且不依赖配置或外部基础设施的 PDF 能力
- **THEN** 系统必须允许该能力以 feature 内 helper 或类的形式实现，而不要求额外创建 module 与 provider 装配

#### Scenario: 定义 REST 请求 DTO
- **WHEN** 后端在 REST 控制器中新增或维护请求模型
- **THEN** 系统必须使用 DTO 命名，并避免继续引入 `*.input.ts` 或 `*Input` 风格命名

### Requirement: 后端模块依赖方向必须保持单向分层
系统 MUST 保证复杂模块中的依赖方向清晰，并统一通过 TypeORM 访问持久化数据；简单模块 MUST 保持控制器到服务到持久化访问的单向依赖；当 PDF 能力存在注入依赖、跨 feature 复用或可替换实现需求时，系统 MUST 通过 Nest service 与 module 保持依赖边界清晰。

#### Scenario: 执行复杂模块请求
- **WHEN** REST 控制器处理复杂模块请求
- **THEN** 控制器必须调用应用层服务，并由基础设施层提供具体的数据访问实现

#### Scenario: 执行简单模块请求
- **WHEN** REST 控制器处理简单模块资源请求
- **THEN** 控制器必须调用服务层，并由服务层通过 TypeORM Repository 完成数据访问

#### Scenario: 装配可扩展 PDF 能力
- **WHEN** 后端实现的 PDF 能力需要注入配置、数据库、对象存储、队列、日志或外部 SDK，或需要被多个 feature 复用
- **THEN** 系统必须通过 Nest service 与 module 装配该能力，并保持明确的依赖方向

#### Scenario: 评估是否新增全局公共 helper
- **WHEN** 后端需要决定某段与 PDF 类似的纯逻辑是否应提升为全局公共 helper 或 utils
- **THEN** 系统必须优先验证该逻辑已被多个 feature 稳定复用、无需 Nest 注入且边界稳定；不满足时必须保留在 feature 内
