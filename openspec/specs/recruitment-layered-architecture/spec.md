## Purpose

TBD

## Requirements

### Requirement: 招聘领域必须统一归位到 recruitment 根模块
系统 MUST 将候选人、简历上传、筛选评分及相关投递能力统一归位到 `recruitment` 领域根模块中，并由领域根模块集中完成 Nest imports、providers、controllers 与 exports 的装配。

#### Scenario: 应用启动装配招聘领域
- **WHEN** Nest 应用启动并加载招聘领域能力
- **THEN** 系统必须通过 `recruitment` 根模块完成招聘相关子能力的统一装配，而不是继续依赖多个平级历史模块分散注册

#### Scenario: 新增招聘子域能力
- **WHEN** 开发者新增职位、投递、候选人或简历相关能力
- **THEN** 新能力必须落在 `recruitment` 领域目录内，并遵循统一的分层结构与模块装配约定

### Requirement: recruitment 目录必须采用四层结构
系统 MUST 在 `recruitment` 下提供 `api`、`application`、`domain`、`infrastructure` 四层目录，并明确各层职责：`api` 负责对外接口与 DTO，`application` 负责用例编排，`domain` 负责核心业务规则与抽象，`infrastructure` 负责持久化与外部技术实现。

#### Scenario: 放置控制器与 DTO
- **WHEN** 系统实现招聘领域的 HTTP 或 SSE 接口
- **THEN** 控制器、DTO 与接口增强代码必须放在 `api` 层，而不能散落在其他层目录中

#### Scenario: 放置用例编排逻辑
- **WHEN** 系统实现跨候选人、简历上传、筛选评分的流程编排
- **THEN** 编排逻辑必须放在 `application` 层，而不能直接堆积在控制器或仓储实现中

#### Scenario: 放置领域规则与抽象
- **WHEN** 系统定义招聘领域实体、值对象、领域服务或仓储接口
- **THEN** 这些内容必须放在 `domain` 层，并保持不依赖技术框架实现细节

#### Scenario: 放置持久化与外部服务实现
- **WHEN** 系统实现 TypeORM 持久化、对象存储、大模型调用或其他外部集成
- **THEN** 具体技术实现必须放在 `infrastructure` 层，并通过抽象向上暴露能力

### Requirement: 历史 applications 业务目录必须消除命名歧义
系统 MUST 去掉 `recruitment/applications` 这一历史业务目录命名，并将其改为更符合业务语义的命名；当该目录表达职位投递/申请业务时，系统 MUST 使用 `job-applications` 作为默认命名，以避免与 `application` 分层混淆。

#### Scenario: 迁移历史 applications 目录
- **WHEN** 系统重构现有 `recruitment/applications` 相关代码
- **THEN** 目录、模块、服务或类型命名必须改为明确表达业务含义的名称，而不能继续保留歧义性的 `applications`

#### Scenario: 新增投递相关代码
- **WHEN** 开发者新增与职位投递或申请相关的实体、服务、控制器或模块
- **THEN** 相关命名必须使用 `job-application` 或等价的明确业务术语，而不能与 `application` 分层名称冲突
