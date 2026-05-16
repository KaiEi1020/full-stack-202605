## MODIFIED Requirements

### Requirement: 后端必须通过 MikroORM + PostgreSQL 管理持久化模型
系统 MUST 使用 MikroORM 实体与 PostgreSQL 数据源作为后端持久化结构的定义来源，并通过 MikroORM 仓储或 EntityManager 执行数据访问。

#### Scenario: 初始化持久化层
- **WHEN** 后端应用启动并需要访问数据库
- **THEN** 系统必须通过 MikroORM + PostgreSQL 数据源建立可复用的数据访问入口

#### Scenario: 查询复杂模块数据
- **WHEN** 复杂模块的应用层请求查询或修改业务数据
- **THEN** 系统必须通过仓储边界访问 MikroORM + PostgreSQL 持久化模型

#### Scenario: 执行简单模块 CRUD
- **WHEN** 简单模块处理直接的数据增删改查请求
- **THEN** 系统必须允许服务层直接通过 MikroORM 的 `EntityManager` 或实体仓库完成 PostgreSQL 持久化操作

## REMOVED Requirements

### Requirement: 后端必须通过 TypeORM 管理持久化模型
**Reason**: 已全面迁移至 MikroORM + PostgreSQL，TypeORM 相关依赖与配置已移除。
**Migration**: 所有实体装饰器改用 MikroORM 语法；所有 `Repository` 注入改用 MikroORM 的 `EntityManager` 或自定义仓储实现；全局模块导入从 `TypeOrmModule` 切换为 `MikroOrmModule`；数据库从 SQLite 切换为 PostgreSQL。
