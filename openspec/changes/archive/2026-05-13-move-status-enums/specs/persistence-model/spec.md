## MODIFIED Requirements

### Requirement: 后端必须通过 Prisma 管理持久化模型
系统 MUST 使用 TypeORM 实体与数据源配置作为后端持久化结构的定义来源，并通过 TypeORM 仓储或 Repository 执行数据访问。数据库层可以引用业务状态枚举用于实体字段定义，但 MUST 不负责承载这些业务状态类型的定义。

#### Scenario: 初始化持久化层
- **WHEN** 后端应用启动并需要访问数据库
- **THEN** 系统必须通过 TypeORM 数据源建立可复用的数据访问入口

#### Scenario: 定义状态字段
- **WHEN** 持久化模型需要为实体声明候选人、岗位或解析状态字段
- **THEN** 系统必须允许实体引用业务状态枚举，但这些枚举定义必须位于业务模块目录或共享业务类型目录，而不是 `core/database`
