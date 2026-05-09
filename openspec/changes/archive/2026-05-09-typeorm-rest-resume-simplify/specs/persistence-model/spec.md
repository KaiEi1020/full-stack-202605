## MODIFIED Requirements

### Requirement: 后端必须通过 Prisma 管理持久化模型
系统 MUST 使用 TypeORM 实体与数据源配置作为后端持久化结构的定义来源，并通过 TypeORM 仓储或 Repository 执行数据访问。

#### Scenario: 初始化持久化层
- **WHEN** 后端应用启动并需要访问数据库
- **THEN** 系统必须通过 TypeORM 数据源建立可复用的数据访问入口

### Requirement: 用户数据访问必须通过仓储边界完成
系统 MUST 在复杂模块中定义数据访问契约，并由基于 TypeORM 的基础设施实现负责读取和写入持久化数据；对于简单 CRUD 模块，系统 MUST 允许直接使用 TypeORM Repository 完成资源数据访问。

#### Scenario: 查询复杂模块数据
- **WHEN** 复杂模块的应用层请求查询或修改业务数据
- **THEN** 系统必须通过仓储边界访问 TypeORM 持久化模型，而不是直接在接口层拼接数据库访问逻辑

#### Scenario: 执行简单模块 CRUD
- **WHEN** 简单模块处理直接的数据增删改查请求
- **THEN** 系统必须允许服务层直接通过 TypeORM Repository 完成持久化操作
