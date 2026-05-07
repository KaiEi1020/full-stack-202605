## ADDED Requirements

### Requirement: 后端必须通过 Prisma 管理持久化模型
系统 MUST 使用 Prisma schema 作为后端持久化结构的定义来源，并通过 Prisma Client 执行数据访问。

#### Scenario: 初始化持久化层
- **WHEN** 后端应用启动并需要访问数据库
- **THEN** 系统必须通过 Prisma Client 建立可复用的数据访问入口

### Requirement: 用户数据访问必须通过仓储边界完成
系统 MUST 在领域层定义用户数据访问契约，并由基于 Prisma 的基础设施实现负责读取持久化数据。

#### Scenario: 查询用户数据
- **WHEN** 应用层请求查询用户列表或单个用户
- **THEN** 系统必须通过用户仓储边界访问 Prisma 持久化模型，而不是直接在应用层或接口层拼接数据库访问逻辑
