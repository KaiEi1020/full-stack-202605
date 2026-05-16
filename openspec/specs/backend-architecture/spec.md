## Purpose

TBD

## Requirements

### Requirement: 后端必须通过分层模块装配用户查询能力
系统 MUST 在当前实现中根据模块复杂度，通过 REST 控制器、应用服务、领域边界、基础设施实现或直接 CRUD 服务装配后端能力；对于仅包含单一纯逻辑且无外部依赖的 PDF 能力，系统 MUST 允许其直接作为贴近业务 feature 的 helper 或类实现，而不强制创建独立 Nest module。

#### Scenario: 装配复杂模块
- **WHEN** 后端应用启动并装配具有明确领域规则的模块
- **THEN** 系统必须允许该模块通过 controller、应用服务与仓储实现协作完成业务流程

#### Scenario: 装配简单模块
- **WHEN** 后端应用启动并装配以资源操作为主的简单模块
- **THEN** 系统必须允许该模块通过 controller、service 与 TypeORM Repository 直接协作完成 CRUD 能力

#### Scenario: 装配单一纯逻辑 PDF 能力
- **WHEN** 后端实现仅由单一方法组成、且不依赖配置或外部基础设施的 PDF 能力
- **THEN** 系统必须允许该能力以 feature 内 helper 或类的形式实现，而不要求额外创建 module 与 provider 装配

### Requirement: 后端模块依赖方向必须保持单向分层
系统 MUST 保证招聘领域这类复杂模块通过明确的四层结构组织代码，并保持 `api -> application -> domain` 的单向依赖关系；基础设施实现 MUST 位于 `infrastructure` 层并向上提供仓储、外部服务或技术能力实现；领域层 MUST 不直接依赖控制器、ORM 实体实现或第三方 SDK。对于简单 CRUD 模块，系统 MAY 继续保留较轻量的 controller-service-repository 结构，但不得将该轻量模式继续扩散到招聘领域重构后的主模块中。

#### Scenario: 执行招聘领域复杂模块请求
- **WHEN** REST 控制器处理招聘领域中的上传、候选人、筛选或评分请求
- **THEN** 控制器必须调用 `application` 层用例服务，并由该层协调领域对象与基础设施实现完成业务流程

#### Scenario: 领域规则与技术实现隔离
- **WHEN** 系统实现候选人状态流转、投递语义或筛选规则
- **THEN** 这些规则必须定义在 `domain` 层，而不是直接写在控制器、ORM 仓储实现或第三方服务适配代码中

#### Scenario: 通过基础设施提供持久化实现
- **WHEN** 应用层需要读取或持久化招聘领域数据
- **THEN** 系统必须通过领域定义的仓储接口访问，并由 `infrastructure/persistence/repository` 提供具体实现

#### Scenario: 区分复杂模块与简单模块结构
- **WHEN** 开发者为招聘领域新增模块或重构既有招聘能力
- **THEN** 系统必须采用四层结构，而不是继续使用简单 CRUD 模块的扁平 service 组织方式

#### Scenario: 执行简单模块请求
- **WHEN** REST 控制器处理简单模块资源请求
- **THEN** 控制器必须调用服务层，并由服务层通过 TypeORM Repository 完成数据访问

#### Scenario: 装配可扩展 PDF 能力
- **WHEN** 后端实现的 PDF 能力需要注入配置、数据库、对象存储、队列、日志或外部 SDK，或需要被多个 feature 复用
- **THEN** 系统必须通过 Nest service 与 module 装配该能力，并保持明确的依赖方向

#### Scenario: 评估是否新增全局公共 helper
- **WHEN** 后端需要决定某段与 PDF 类似的纯逻辑是否应提升为全局公共 helper 或 utils
- **THEN** 系统必须优先验证该逻辑已被多个 feature 稳定复用、无需 Nest 注入且边界稳定；不满足时必须保留在 feature 内
