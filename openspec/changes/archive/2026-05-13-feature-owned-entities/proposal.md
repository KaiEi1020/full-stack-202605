## Why

当前后端将 `UserEntity`、`ResumeEntity`、`JobRequirementEntity` 集中放在 `backend/src/core/database/`，导致数据库基础设施与具体业务实体混在一起。随着模块数量增长，这会让 `core/database` 膨胀成新的共享杂糅目录，削弱 feature 边界，也不利于后续同时支持简单 CRUD 模块和复杂 DDD 模块。

现在推进实体归属调整，可以在不改变业务行为的前提下，把数据库基础设施和业务实体拆开，让实体默认跟随 feature 演进，而不是继续堆在公共 database 目录中。

## What Changes

- 将业务实体从 `backend/src/core/database/` 迁移到各自拥有它们的 feature module 中。
- 保留 `backend/src/core/database/` 作为 TypeORM 配置、数据库模块和连接初始化所在的基础设施目录。
- 为简单 CRUD 模块采用 feature 内部 `entities/` 归属方式。
- 为复杂 DDD 模块采用 `infrastructure/persistence/entities/` 归属方式，避免将 ORM entity 与领域对象混淆。
- 更新实体注册、模块导入和相关引用路径，确保迁移后应用行为不变。

## Capabilities

### New Capabilities
- `feature-owned-entities`: 定义单体 NestJS 项目中业务实体默认归属 feature module、数据库基础设施归属 `core/database` 的结构约定

### Modified Capabilities
- `backend-architecture`: 调整后端架构要求，使其明确区分数据库基础设施与业务实体归属，并支持 CRUD/DDD 混合模式下的实体放置策略

## Impact

- 受影响代码主要位于 `backend/src/core/database/` 与 `backend/src/modules/**`。
- 不改变对外 API，也不引入新的外部依赖。
- 需要调整 TypeORM 实体注册来源、模块 imports 和内部相对引用。
- 需要通过构建、测试和启动验证来确认迁移后依赖注入与实体装配正常。
