## Purpose

TBD

## Requirements

### Requirement: 用户实体必须迁移至 MikroORM 并位于 persistence/entities
系统 MUST 将 `UserEntity` 从 TypeORM 装饰器迁移为 MikroORM 装饰器，并保持其位于 `user/infrastructure/persistence/entities/user.entity.ts`。

#### Scenario: 使用 MikroORM 定义用户实体
- **WHEN** 系统需要持久化用户数据
- **THEN** `UserEntity` MUST 使用 `@Entity({ tableName: 'users' })`、`@PrimaryKey()`、`@Property()` 等 MikroORM 装饰器

### Requirement: 用户仓储实现必须迁移至 repositories 目录并重构为 MikroORM
系统 MUST 将现有的 `typeorm-user.repository.ts` 重构为基于 MikroORM 的实现，并迁移至 `user/infrastructure/repositories/mikroorm-user.repository.ts`。

#### Scenario: 通过 MikroORM 实现用户仓储
- **WHEN** 系统运行时
- **THEN** `MikroOrmUserRepository` MUST 使用 MikroORM 的 `EntityManager` 完成用户的增删改查，并实现 `UserRepository` 接口

#### Scenario: 原 TypeORM 仓储文件清理
- **WHEN** 迁移完成后
- **THEN** `user/infrastructure/typeorm-user.repository.ts` MUST 被删除，所有模块导入指向新的 MikroORM 实现

### Requirement: UserModule 必须注册 MikroORM 实体与仓储
系统 MUST 更新 `UserModule`，移除 `TypeOrmModule.forFeature`，改为使用 `MikroOrmModule.forFeature([UserEntity])` 注册实体，并将仓储提供者绑定到新的 MikroORM 实现。

#### Scenario: 启动 UserModule
- **WHEN** Nest 加载 `UserModule`
- **THEN** 模块 MUST 正确注册 `UserEntity` 与 `MikroOrmUserRepository`，且 `USER_REPOSITORY` 令牌解析到 MikroORM 实现
