## Purpose

TBD

## Requirements

### Requirement: docker-compose.yml 必须包含 PostgreSQL 服务
系统 MUST 在 `docker-compose.yml` 中定义 PostgreSQL 数据库服务，替代现有的 mysql 服务，并为后端提供可用的数据库连接。

#### Scenario: 启动部署环境数据库
- **WHEN** 运维人员执行 `docker-compose up -d`
- **THEN** 系统 MUST 启动 PostgreSQL 容器，并暴露默认端口（5432）供后端连接

#### Scenario: 数据库数据持久化
- **WHEN** PostgreSQL 容器运行并写入数据
- **THEN** 数据 MUST 通过挂载卷持久化到宿主机 `./postgres/data`，容器重建后数据不丢失

### Requirement: PostgreSQL 服务必须包含健康检查
系统 MUST 为 PostgreSQL 服务配置健康检查，确保数据库就绪后才可被依赖服务使用。

#### Scenario: 数据库就绪检测
- **WHEN** PostgreSQL 容器启动
- **THEN** 系统 MUST 定期执行 `pg_isready` 检测，直到数据库可接受连接

### Requirement: PostgreSQL 服务密码必须通过环境变量管理
系统 MUST 将 PostgreSQL 的用户名、密码、数据库名等敏感配置通过环境变量注入，而不是硬编码在 `docker-compose.yml` 中。

#### Scenario: 数据库密码从环境变量读取
- **WHEN** PostgreSQL 容器启动
- **THEN** `POSTGRES_PASSWORD` MUST 从环境变量 `DATABASE_PASSWORD` 读取，而不是在 compose 文件中硬编码明文

#### Scenario: 数据库用户名从环境变量读取
- **WHEN** PostgreSQL 容器启动
- **THEN** `POSTGRES_USER` MUST 从环境变量 `DATABASE_USER` 读取，默认值为 `postgres`

#### Scenario: 数据库名从环境变量读取
- **WHEN** PostgreSQL 容器启动
- **THEN** `POSTGRES_DB` MUST 从环境变量 `DATABASE_NAME` 读取，默认值为 `app_db`

### Requirement: 后端服务必须正确连接 PostgreSQL
系统 MUST 调整后端服务的环境变量，使其通过 `DATABASE_URL` 连接 PostgreSQL，并建立服务依赖关系。

#### Scenario: 后端启动时数据库已就绪
- **WHEN** 后端容器启动
- **THEN** 后端 MUST 使用 `DATABASE_URL` 连接到 PostgreSQL，`DATABASE_URL` 中的密码 MUST 引用 `DATABASE_PASSWORD` 环境变量，并成功执行初始 schema 同步或迁移
