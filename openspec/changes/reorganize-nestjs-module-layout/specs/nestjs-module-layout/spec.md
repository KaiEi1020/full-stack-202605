## ADDED Requirements

### Requirement: 单体 NestJS 项目必须区分业务模块目录与系统级目录
系统 MUST 在顶层目录中明确区分业务模块与系统级基础设施模块。业务能力 MUST 归入 `src/modules/`，系统级支撑能力 MUST 归入 `src/core/`，跨模块复用且不依赖具体业务语义的共享代码 MAY 归入 `src/shared/`。

#### Scenario: 放置业务模块
- **WHEN** 开发者为单体 NestJS 应用新增或迁移用户、候选人、简历上传、商品、订单等业务能力
- **THEN** 系统必须将这些能力对应的模块放置在 `src/modules/` 下

#### Scenario: 放置系统级能力
- **WHEN** 开发者组织数据库接入、存储适配、PDF 解析、SSE 推送或大模型接入等系统级能力
- **THEN** 系统必须将这些模块放置在 `src/core/` 下

### Requirement: 业务模块内部必须支持复杂模块使用 DDD、简单模块使用 CRUD
系统 MUST 允许业务模块依据复杂度采用不同的内部组织方式。存在明显领域规则、状态流转、跨服务协作或外部适配器编排的复杂模块 MUST 支持使用 DDD 分层；以直接资源操作为主的简单模块 MUST 支持使用 controller/service/repository 风格的 CRUD 结构。

#### Scenario: 新增复杂领域模块
- **WHEN** 开发者新增商品、订单或其他包含复杂业务规则的领域模块
- **THEN** 系统必须允许该模块在 `src/modules/` 下采用 `application`、`domain`、`infrastructure` 等分层结构组织代码

#### Scenario: 新增简单资源模块
- **WHEN** 开发者新增以直接增删改查为主且业务规则简单的模块
- **THEN** 系统必须允许该模块在 `src/modules/` 下采用 controller、service、repository 或 entity 的直接 CRUD 结构组织代码

### Requirement: 目录迁移后应用装配行为必须保持不变
系统 MUST 在目录归类调整后继续正确装配所有 NestJS 模块、依赖注入关系与启动流程，不得因目录结构变化改变既有运行行为。

#### Scenario: 应用启动并装配迁移后的模块
- **WHEN** 开发者完成目录迁移并启动后端应用
- **THEN** 系统必须成功加载 `src/modules/` 与 `src/core/` 下的模块，并保持既有依赖注入与启动行为正常
