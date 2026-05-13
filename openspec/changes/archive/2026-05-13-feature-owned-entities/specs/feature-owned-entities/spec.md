## ADDED Requirements

### Requirement: 业务实体必须默认归属 owning feature
系统 MUST 让业务实体默认归属于拥有其生命周期和写入规则的 feature module，而不是长期集中放在数据库基础设施目录中。

#### Scenario: 放置简单 CRUD 模块实体
- **WHEN** 开发者为简单 CRUD 模块定义或迁移实体
- **THEN** 系统必须允许该实体放置在 `src/modules/<feature>/entities/` 下，并与该模块的 service/controller 一起维护

#### Scenario: 放置复杂 DDD 模块实体
- **WHEN** 开发者为复杂 DDD 模块定义或迁移 ORM Entity
- **THEN** 系统必须允许该实体放置在 `src/modules/<feature>/infrastructure/persistence/entities/` 下，而不是放入 `domain/`

### Requirement: 数据库基础设施目录必须只承载数据库基础设施职责
系统 MUST 让 `src/core/database/` 仅承载数据库连接、TypeORM 配置、数据库模块和相关基础设施能力，而不是作为所有业务实体的长期归属目录。

#### Scenario: 组织数据库基础设施
- **WHEN** 开发者维护数据库连接、TypeORM 配置或数据库基础设施模块
- **THEN** 系统必须将这些代码保留在 `src/core/database/` 下

#### Scenario: 迁移业务实体后保留数据库基础设施
- **WHEN** 开发者将业务实体迁移到 feature module
- **THEN** 系统必须仍然允许 `src/core/database/` 统一注册和装配这些实体，而不要求实体继续驻留在该目录内
