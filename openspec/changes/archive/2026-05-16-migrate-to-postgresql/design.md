## Context

当前项目使用 SQLite + TypeORM 技术栈，存在三方面问题：

**数据库层面**：SQLite（`sql.js`）在高并发写入下性能急剧下降，动态类型系统弱约束，数据文件难以在多人开发与 CI/CD 环境中统一管理，PostgreSQL 支持更丰富的索引、JSONB、全文检索等高级特性。`docker-compose.yml` 中仍保留了一个未被使用的 `mysql` 服务，与实际技术栈不一致。

**ORM 层面**：TypeORM 的 `sql.js` 驱动维护不足，装饰器语法冗长，缺乏 Identity Map 与 Unit of Work 等现代 ORM 特性，与 DDD 的 Data Mapper 模式契合度低。MikroORM 的 `@mikro-orm/nestjs` 官方模块提供同等集成体验，且类型安全更强。

**目录结构层面**：recruitment 模块将 TypeORM 实体放在 `domain/entity/`，领域层直接依赖 ORM 框架；user 模块实体在 `infrastructure/persistence/entities/` 但仓储实现（`typeorm-user.repository.ts`）散落在 `infrastructure/` 根目录。两模块目录约定不统一，且 recruitment 缺乏仓储抽象，应用层直接注入 `@InjectRepository`。

## Goals / Non-Goals

**Goals：**
- 将后端数据库从 SQLite 迁移至 PostgreSQL 15+。
- 将后端 ORM 从 TypeORM 迁移至 MikroORM。
- 统一所有模块的 infrastructure 层目录结构为 `persistence/entities/` + `repositories/`。
- 将 recruitment 领域实体从 `domain/entity/` 迁移至 `infrastructure/persistence/entities/`，并改为 MikroORM 装饰器。
- 为 recruitment 模块定义仓储接口，在 `infrastructure/repositories/` 中提供 MikroORM 实现。
- 在 `docker-compose.yml` 中定义 PostgreSQL 服务，替代现有的 mysql 服务。
- 新增 `docker-compose.local.yml`，提供独立的本地开发数据库启动能力。
- 更新环境变量及实体类型映射，适配 MikroORM + PostgreSQL。
- 更新测试配置，使 E2E/单元测试可在 MikroORM + PostgreSQL 环境下运行。

**Non-Goals：**
- 不修改前端代码与前后端 API 契约。
- 不改动业务逻辑与领域规则。
- 不执行复杂的数据迁移脚本（假设新环境允许 schema 重建或手动迁移）。
- 不引入连接池中间件（如 PgBouncer）。
- 不引入独立的领域模型 + 映射器（当前项目规模较小，实体直接下沉到 infrastructure 即可）。

## Decisions

### 1. 选用 PostgreSQL 替代 SQLite
- **Rationale**：PostgreSQL 是开源关系型数据库中最成熟的选择，支持 ACID、复杂查询、JSONB、全文检索，且与 NestJS/MikroORM 生态集成良好。
- **Alternative considered**：继续使用 SQLite 或切换到 MySQL。放弃 SQLite 是因为并发与运维瓶颈；放弃 MySQL 是因为 PostgreSQL 在标准兼容性与高级特性上更优，且团队已倾向于 PostgreSQL。

### 2. 选用 MikroORM 替代 TypeORM
- **Rationale**：MikroORM 的 `@mikro-orm/postgresql` 驱动性能优于 TypeORM 的 `sql.js`；装饰器更简洁（`@Entity()`、`@Property()`）；内置 Identity Map 与 Unit of Work 模式更符合 DDD 实践；NestJS 官方提供 `@mikro-orm/nestjs` 模块，集成成本低。
- **Alternative considered**：继续保留 TypeORM 但仅重构目录结构。放弃原因是 TypeORM 的 sql.js 方案在并发与大数据量场景下存在已知瓶颈，且社区维护活跃度下降。

### 3. 统一目录结构为 `persistence/entities` + `repositories`
- **Rationale**：明确区分「数据库模型」（MikroORM 实体）与「仓储实现」（数据访问逻辑），使 `infrastructure` 层内部职责清晰。所有模块遵循同一约定，降低认知负担。
- **目录约定**：
  - `infrastructure/persistence/entities/`：存放 `@Entity()` 数据库模型（如 `job.entity.ts`、`resume.entity.ts`）
  - `infrastructure/repositories/`：存放仓储实现（如 `job.repository.impl.ts`、`resume.repository.impl.ts`）
- **Alternative considered**：将实体保留在 `domain/entity` 并通过「数据映射器」完全解耦。放弃原因是当前项目规模较小，引入独立的领域模型 + 映射器会带来过多样板代码；将实体下沉到 `infrastructure/persistence/entities` 是更务实的折中方案。

### 4. Recruitment 模块引入仓储接口
- **Rationale**：消除 `RecruitmentService` 对 `@InjectRepository` 的直接依赖，使应用层仅依赖领域层定义的抽象接口。
- **实现方式**：在 `recruitment/domain/` 下定义 `ResumeRepository`、`JobRepository`、`JobApplicationRepository` 接口；在 `recruitment/infrastructure/repositories/` 下提供 `MikroOrmResumeRepository` 等实现。

### 5. 使用 `docker-compose.yml` 定义生产/部署环境的数据库服务
- **Rationale**：统一基础设施定义，将 mysql 服务替换为 PostgreSQL，使 `docker-compose.yml` 与后端实际数据库一致。
- **配置细节**：
  - 镜像：`postgres:15-alpine`
  - 环境变量：`POSTGRES_USER`、`POSTGRES_PASSWORD`、`POSTGRES_DB`
  - 数据卷：`./postgres/data:/var/lib/postgresql/data`
  - 健康检查：`pg_isready`
  - 资源限制：参考现有 mysql 服务的 `deploy.resources.limits`

### 6. 新增 `docker-compose.local.yml` 用于本地开发
- **Rationale**：开发者需要一种不依赖完整 `docker-compose.yml`（其中包含 backend、frontend）的方式快速启动本地数据库。
- **配置细节**：仅包含 `db` 服务，使用标准端口映射（如 `5432:5432`），数据卷挂载到本地 `./postgres/local-data`，方便独立管理。

### 7. 使用 `DATABASE_URL` 作为统一连接串
- **Rationale**：`DATABASE_URL`（如 `postgresql://user:pass@localhost:5432/dbname`）是业界标准，兼容 Heroku、Railway、AWS RDS 等托管服务，避免为每种部署环境维护分散的配置项。
- **迁移策略**：移除 `SQLITE_DATABASE_PATH`，在 `.env` 与 `backend/.env` 中引入 `DATABASE_URL`。
- **密码管理**：数据库密码 MUST 通过独立的环境变量 `DATABASE_PASSWORD` 管理，`DATABASE_URL` 中的密码部分引用该变量值。同时提供 `DATABASE_USER`、`DATABASE_NAME`、`DATABASE_HOST`、`DATABASE_PORT` 等独立变量，便于 docker-compose 服务与后端应用分别读取所需配置。

### 8. TypeORM → MikroORM 实体装饰器映射
- **Rationale**：MikroORM 与 TypeORM 的装饰器不完全兼容，需要逐字段映射。
- **映射规则**：
  - `@Entity('table')` → `@Entity({ tableName: 'table' })`
  - `@PrimaryColumn('text')` → `@PrimaryKey({ type: 'uuid' })` 或 `@PrimaryKey({ type: 'varchar', length: 36 })`
  - `@Column('text', { nullable: true })` → `@Property({ type: 'text', nullable: true })` 或 `@Property({ nullable: true })`
  - `@Column('integer', { nullable: true })` → `@Property({ type: 'integer', nullable: true })`
  - `@Column('datetime', { nullable: true })` → `@Property({ type: 'timestamptz', nullable: true })`
  - `@CreateDateColumn()` → `@CreatedAt()` 或 `@Property({ onCreate: () => new Date() })`
  - `@UpdateDateColumn()` → `@UpdatedAt()` 或 `@Property({ onUpdate: () => new Date() })`
  - JSON 字符串字段（如 `requiredSkillsJson`）保持 `type: 'text'` 并在应用层自行序列化/反序列化，以兼容现有数据结构

## Risks / Trade-offs

- **[Risk] 三重变更叠加风险** → 数据库切换 + ORM 迁移 + 目录重构同时进行，中间状态可能导致编译失败。Mitigation：按模块分批实施（先 user，后 recruitment），每批独立验证编译与测试。
- **[Risk] 数据迁移成本** → 现有 SQLite 数据需要导出/导入到 PostgreSQL。Mitigation：提供 `sqlite3` 导出脚本或允许在新环境重新初始化 schema。
- **[Risk] 字段类型兼容性** → SQLite 的宽松类型可能导致部分历史数据在 PostgreSQL 强约束下写入失败。Mitigation：在迁移前清洗数据，或在实体中保留适当的 `nullable` 与默认值。
- **[Risk] 测试覆盖率下降** → 现有测试大量 mock TypeORM `Repository`，需要重写为 mock 仓储接口或集成测试。Mitigation：优先重写 E2E 测试确保核心链路可用。
- **[Risk] 开发环境依赖 Docker** → 本地开发需要运行 PostgreSQL 容器。Mitigation：提供 `docker-compose.local.yml` 一键启动与清晰的启动命令文档。
- **[Trade-off] 领域层不再持有纯领域模型** → 将实体放在 `infrastructure/persistence/entities` 意味着应用层可能直接引用数据库模型。考虑到当前项目规模，这是可接受的务实选择。
- **[Trade-off] 测试速度下降** → PostgreSQL 集成测试比 SQLite 内存数据库慢。Mitigation：保留单元测试快速反馈，E2E 测试使用 PostgreSQL 保证真实性。

## Migration Plan

1. **准备阶段**：安装 MikroORM + PostgreSQL 依赖（`@mikro-orm/core`、`@mikro-orm/postgresql`、`@mikro-orm/nestjs`、`pg`），移除 TypeORM + SQLite 依赖（`@nestjs/typeorm`、`typeorm`、`sql.js`）。
2. **Docker 配置**：
   - 更新 `docker-compose.yml`：移除 `mysql`，添加 `db`（PostgreSQL）服务。
   - 创建 `docker-compose.local.yml`：仅包含 `db` 服务。
3. **环境变量更新**：修改 `.env`、`backend/.env`，引入 `DATABASE_URL`，移除 `SQLITE_DATABASE_PATH`。
4. **全局配置替换**：在 `AppModule` 中替换 `TypeOrmModule.forRoot` 为 `MikroOrmModule.forRoot`；创建 `mikro-orm.config.ts`，使用 PostgreSQL 驱动与 `DATABASE_URL`。
5. **User 模块先行**：将 `UserEntity` 改为 MikroORM 装饰器；将 `TypeOrmUserRepository` 改为 `MikroOrmUserRepository` 并迁移至 `infrastructure/repositories/`；更新 `UserModule`。
6. **Recruitment 实体迁移**：迁移 Resume、Job、JobApplication 实体至 `infrastructure/persistence/entities/`，改用 MikroORM 装饰器；删除 `domain/entity/`。
7. **Recruitment 仓储**：定义仓储接口；提供 MikroORM 仓储实现于 `infrastructure/repositories/`；更新 `RecruitmentModule` 与应用层服务。
8. **测试修复**：更新 E2E 测试与单元测试，替换 TypeORM 相关的模块导入与 mock。
9. **验证阶段**：启动 `docker-compose.local.yml`，运行后端与完整测试套件。

## Open Questions

- 现有 SQLite 数据是否需要保留并迁移，还是允许在新环境中重建 schema？
- 是否需要在 `docker-compose.yml` 中为后端服务增加 `depends_on` 的 `condition: service_healthy`，确保数据库就绪后再启动后端？
- `RecruitmentService` 中部分复杂查询（如 `listJobRankings` 中的跨表聚合）是否需要在仓储层封装为独立方法？
