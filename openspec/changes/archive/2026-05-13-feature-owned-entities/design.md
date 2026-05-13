## Context

当前后端已经完成 `modules/core/shared` 的顶层整理，但具体业务实体仍然集中在 `backend/src/core/database/`。这让 `core/database` 同时承担数据库基础设施和业务实体归属两种职责。用户希望系统后续既支持简单 CRUD 模块，也支持复杂 DDD 模块，因此实体归属策略必须能同时覆盖这两类模块，而不能继续沿用“所有实体放 database”的集中式做法。

## Goals / Non-Goals

**Goals:**
- 将数据库基础设施职责与业务实体归属职责拆开。
- 让业务实体默认回归 owning feature。
- 支持简单 CRUD 模块和复杂 DDD 模块使用不同但一致可解释的实体目录结构。
- 保持现有 API、依赖注入和运行行为不变。

**Non-Goals:**
- 不重写现有业务逻辑。
- 不把 ORM Entity 进一步抽象成新的领域模型体系。
- 不引入 path alias、monorepo 或新的 ORM。
- 不在本次变更中调整数据库 schema 或接口契约。

## Decisions

### 1. `core/database` 只保留数据库基础设施

保留 `DatabaseModule`、`typeorm.config.ts`、连接初始化、可能的迁移能力在 `core/database`，但不再把它当成所有业务实体的长期归属目录。

**原因：** 数据库基础设施是全局共享能力，而实体是业务归属问题，两者职责不同。

### 2. 简单 CRUD 模块把 Entity 放在 feature 内部

对于简单模块，实体直接放在 `modules/<feature>/entities/`，与 controller、service、DTO 一起维护。

**原因：** 简单模块不需要为放实体额外引入复杂分层；就地归属可以减少跨目录跳转和共享耦合。

### 3. 复杂 DDD 模块把 ORM Entity 放在 `infrastructure/persistence/entities`

对于复杂模块，ORM Entity 不放进 `domain/`，而是放到 `modules/<feature>/infrastructure/persistence/entities/`；`domain/` 保留领域对象、接口、聚合和业务规则。

**原因：** ORM Entity 是持久化模型，不应和领域模型混在一起。

### 4. 当前仓库按 owner 迁移实体

- `UserEntity` 归属 `user`
- `ResumeEntity`、`JobRequirementEntity` 归属 `candidate` 或真正拥有其生命周期的 feature
- `typeorm.config.ts` 改为从各 feature 引入实体并注册
- feature 模块改为引用本模块或 owning feature 暴露的实体

**原因：** 是否归属某模块看谁拥有写入规则和生命周期，而不是谁会读取它。

## Risks / Trade-offs

- [实体跨模块读取变多] → 通过明确 owner，允许其他模块读取 owning feature 暴露的实体或通过服务边界访问
- [TypeORM 注册路径分散] → 在 `typeorm.config.ts` 统一收口注册
- [迁移过程中 import 易错] → 通过构建、测试和启动验证兜底
- [`ResumeEntity` owner 边界不清] → 在实施前先明确由 `candidate` 还是 `resume-upload` 持有生命周期，再迁移
