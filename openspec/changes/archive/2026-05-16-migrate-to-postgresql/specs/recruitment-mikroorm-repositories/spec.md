## ADDED Requirements

### Requirement: 招聘领域实体必须迁移至 infrastructure/persistence/entities
系统 MUST 将招聘领域（Resume、Job、JobApplication）的数据库模型从 `recruitment/domain/entity/` 迁移至 `recruitment/infrastructure/persistence/entities/`，并使用 MikroORM 装饰器重新定义。

#### Scenario: 定义 Resume 实体
- **WHEN** 系统需要持久化简历数据
- **THEN** `ResumeEntity` 必须位于 `recruitment/infrastructure/persistence/entities/resume.entity.ts`，并使用 MikroORM 装饰器

#### Scenario: 定义 Job 实体
- **WHEN** 系统需要持久化职位数据
- **THEN** `JobEntity` 必须位于 `recruitment/infrastructure/persistence/entities/job.entity.ts`，字段映射必须与现有业务一致

#### Scenario: 定义 JobApplication 实体
- **WHEN** 系统需要持久化职位投递数据
- **THEN** `JobApplicationEntity` 必须位于 `recruitment/infrastructure/persistence/entities/job-application.entity.ts`，保留所有现有字段与默认值

### Requirement: 招聘领域必须定义仓储接口并在 infrastructure 层实现
系统 MUST 在招聘领域层定义 `ResumeRepository`、`JobRepository`、`JobApplicationRepository` 接口，并在 `recruitment/infrastructure/repositories/` 中提供基于 MikroORM 的实现。

#### Scenario: 应用层通过接口访问简历数据
- **WHEN** `RecruitmentService` 需要查询或保存简历
- **THEN** 服务 MUST 通过注入 `ResumeRepository` 接口完成操作，而不是直接依赖 MikroORM 的 `EntityRepository`

#### Scenario: 基础设施层提供 MikroORM 实现
- **WHEN** 系统运行时
- **THEN** `recruitment/infrastructure/repositories/` 中的 `MikroOrmResumeRepository`、`MikroOrmJobRepository`、`MikroOrmJobApplicationRepository` MUST 实现对应接口，并通过 NestJS 提供者注册为接口的实现

### Requirement: 原 domain/entity 目录必须清理
系统 MUST 在确认所有引用迁移完成后，删除 `recruitment/domain/entity/` 目录及其中的 TypeORM 实体文件。

#### Scenario: 编译时无残留 TypeORM 引用
- **WHEN** 开发者编译后端项目
- **THEN** `recruitment/domain/entity/` 目录不应存在，且编译错误中不应出现对旧实体路径的引用
