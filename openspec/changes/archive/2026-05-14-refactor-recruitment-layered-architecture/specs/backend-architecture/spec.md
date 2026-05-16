## MODIFIED Requirements

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
