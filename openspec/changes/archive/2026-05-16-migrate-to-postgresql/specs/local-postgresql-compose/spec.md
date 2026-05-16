## ADDED Requirements

### Requirement: 必须提供 docker-compose.local.yml 用于本地开发
系统 MUST 在项目根目录提供 `docker-compose.local.yml`，其中仅包含 PostgreSQL 服务，供开发者在本地独立启动数据库容器。

#### Scenario: 本地启动开发数据库
- **WHEN** 开发者执行 `docker-compose -f docker-compose.local.yml up -d`
- **THEN** 系统 MUST 启动一个 PostgreSQL 容器，映射宿主机 5432 端口，且不与生产/部署配置耦合

#### Scenario: 本地数据库数据隔离
- **WHEN** 本地开发数据库运行并写入数据
- **THEN** 数据 MUST 持久化到 `./postgres/local-data`，与部署环境的数据卷路径隔离

### Requirement: docker-compose.local.yml 必须包含最小必要配置
系统 MUST 确保 `docker-compose.local.yml` 仅包含数据库服务及运行所需的最小环境变量配置，不包含 backend、frontend 或其他服务。

#### Scenario: 检查本地 compose 文件内容
- **WHEN** 开发者查看 `docker-compose.local.yml`
- **THEN** 文件中 SHOULD 仅存在 `db`（或等效命名的 PostgreSQL）服务定义，以及对应的数据卷与环境变量
