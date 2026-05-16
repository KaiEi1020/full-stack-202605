## MODIFIED Requirements

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
- **WHEN** 系统实现 MikroORM 持久化、对象存储、大模型调用或其他外部集成
- **THEN** 具体技术实现必须放在 `infrastructure` 层，并通过抽象向上暴露能力

### Requirement: infrastructure 层必须统一使用 persistence/entities 与 repositories 子目录
系统 MUST 在 `recruitment/infrastructure/` 下提供 `persistence/entities/` 子目录存放 MikroORM 数据库模型，并提供 `repositories/` 子目录存放仓储实现。其他模块（如 user）的 infrastructure 层 MUST 遵循同一目录约定。

#### Scenario: 查找招聘领域的数据库实体
- **WHEN** 开发者需要查看或修改招聘领域的数据库模型
- **THEN** 相关文件必须位于 `recruitment/infrastructure/persistence/entities/`，而不是 `recruitment/domain/entity/`

#### Scenario: 查找招聘领域的仓储实现
- **WHEN** 开发者需要查看或修改招聘领域的数据访问实现
- **THEN** 相关文件必须位于 `recruitment/infrastructure/repositories/`，并使用 MikroORM 实现对应接口

#### Scenario: 用户模块遵循统一目录结构
- **WHEN** 开发者查看用户模块的基础设施层
- **THEN** 用户实体必须位于 `user/infrastructure/persistence/entities/`，仓储实现必须位于 `user/infrastructure/repositories/`
