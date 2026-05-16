# Backend

这个目录是当前项目的后端服务。

## 目录结构

```text
your-project/
├── src/
│   ├── main.ts                    # 项目入口（启动 Nest）
│   ├── app.module.ts              # 根模块（导入所有业务模块）
│   │
│   │   # ============================
│   │   # 1. 核心基础层（与 modules 同级）
│   │   # ============================
│   ├── core/                      # 【核心全局配置】只放框架级、通用基础能力
│   │   ├── database/              # 数据库配置（TypeORM/Prisma）
│   │   ├── config/                # 环境变量、配置管理
│   │   ├── exceptions/            # 全局异常过滤器
│   │   ├── guards/                # 全局守卫（鉴权通用）
│   │   ├── interceptors/          # 全局拦截器（响应格式化、日志）
│   │   └── core.module.ts         # 核心模块
│   │
│   │   # ============================
│   │   # 2. 公共通用层（与 modules 同级）
│   │   # ============================
│   ├── common/                    # 【公共工具】所有模块都能复用
│   │   ├── decorators/            # 自定义装饰器（@CurrentUser 等）
│   │   ├── dto/                   # 全局 DTO（分页、排序）
│   │   ├── enums/                 # 全局枚举
│   │   ├── utils/                 # 工具函数
│   │   ├── constants/             # 全局常量
│   │   └── pipes/                 # 全局管道
│   │
│   │   # ============================
│   │   # 3. 业务领域层（最重要）
│   │   # ============================
│   ├── modules/                   # 【所有业务领域】DDD 模块都放这里
│   │   ├── recruitment/           # 招聘领域（复杂领域模块示例）
│   │   │   ├── recruitment.module.ts
│   │   │   ├── api/               # 接口层（controller、dto、接口增强）
│   │   │   │   ├── dto/
│   │   │   │   ├── controller/
│   │   │   │   └── decorator/filter/
│   │   │   ├── application/       # 应用层（use case、service、command、query）
│   │   │   │   ├── service/
│   │   │   │   └── command/query/
│   │   │   ├── domain/            # 领域层（entity、vo、domain service、repository interface）
│   │   │   │   ├── entity/
│   │   │   │   ├── vo/
│   │   │   │   ├── service/
│   │   │   │   └── repository/
│   │   │   └── infrastructure/    # 基础设施层（持久化实现、第三方服务适配）
│   │   ├── user/                  # 用户领域
│   │   ├── auth/                  # 认证领域
│   │   ├── jobs/                  # 职位/岗位相关业务领域
│   │   └── ...其他业务模块
│   │
│   │   # ============================
│   │   # 4. 可选：后台任务 / 消息队列
│   │   # ============================
│   ├── jobs/                      # 定时任务、队列任务
│
├── .env                           # 环境变量
├── nest-cli.json                  # Nest 配置
├── package.json
└── tsconfig.json
```

## 模块说明

| 模块 | 作用 |
| --- | --- |
| `core/database` | 数据库配置、TypeORM/Prisma 装配、数据库基础设施 |
| `core/config` | 环境变量与配置管理 |
| `core/exceptions` | 全局异常过滤能力 |
| `core/guards` | 全局守卫与通用鉴权能力 |
| `core/interceptors` | 全局响应格式化、日志等拦截能力 |
| `common/decorators` | 所有业务模块可复用的自定义装饰器 |
| `common/dto` | 与具体业务无关的全局 DTO，例如分页、排序 |
| `common/enums` | 跨模块稳定复用的全局枚举 |
| `common/utils` | 与业务无关的工具函数 |
| `common/constants` | 跨模块稳定复用的常量 |
| `common/pipes` | 全局或跨模块复用的管道 |
| `modules/recruitment` | 招聘领域根模块，承载复杂招聘业务的四层结构 |
| `modules/jobs` | 职位/岗位相关业务能力 |
| `modules/user` | 用户管理与注册 |
| `modules/auth` | 认证与授权相关业务能力 |
| `jobs/` | 定时任务、异步任务、消息队列消费等后台任务 |

## 结构约定

### 顶层约定

| 目录 | 约定 |
| --- | --- |
| `src/core` | 只放框架级、系统级、全局基础能力，不放具体业务流程；属于运行必需、全局启用、不可缺少的框架级能力 |
| `src/common` | 只放稳定、业务无关、可被多个模块复用的通用代码；属于按需引入、非必需的工具级能力 |
| `src/modules` | 放所有业务领域模块，按领域边界组织代码 |
| `src/jobs` | 放独立于 HTTP 请求链路的后台任务、定时任务、队列消费逻辑 |

### NestJS + 企业级架构规范

| 目录 | 定义 |
| --- | --- |
| `core` | 框架级、运行必需、全局启用、不可缺少 |
| `common` | 工具级、可复用、按需引入、非必需 |

### 模块内部约定

支持两种结构并存，但招聘领域必须采用四层结构。

| 场景 | 推荐结构 |
| --- | --- |
| 简单 CRUD 模块 | `controller + service + dto + entities` |
| 复杂招聘领域模块 | `api + application + domain + infrastructure` |

### recruitment 四层结构约定

```text
src/
└── recruitment/
    ├── recruitment.module.ts
    ├── api/                    # 接口层（controller, dto）
    │   ├── dto/
    │   ├── controller/         
    │   │   ├── job.controller.ts
    │   │   └── resume.controller.ts
    │   └── decorator/filter/
    ├── application/
    │   ├── service/
    │   │   ├── job.service.ts
    │   │   └── resume.service.ts
    │   └── command/query/
    ├── domain/
    │   ├── entity/
    │   │   ├── job.entity.ts
    │   │   └── resume.entity.ts
    │   ├── vo/
    │   ├── service/
    │   │   ├── job.domain-service.ts
    │   │   └── resume.domain-service.ts
    │   └── repository/
    │       ├── job.repository.interface.ts
    │       └── resume.repository.interface.ts
    └── infrastructure/          # 基础设施（技术实现）
        ├── persistence/         # 数据库实现
        └── repositories/        # 仓储实现
            ├── job.repository.impl.ts
            └── resume.repository.impl.ts
```

| 层 | 职责 |
| --- | --- |
| `api` | 对外接口层，放 controller、请求/响应 DTO、接口增强代码 |
| `application` | 用例编排层，放 use case service、command、query，不直接承载底层技术细节 |
| `domain` | 领域规则层，放 entity、value object、domain service、repository interface |
| `infrastructure` | 技术实现层，放持久化实现与仓储实现等技术细节 |

### recruitment 依赖方向约定

| 方向 | 约束 |
| --- | --- |
| `api -> application` | 控制器只调用用例服务，不直接写领域规则或基础设施细节 |
| `application -> domain` | 应用层负责编排流程，依赖领域对象和仓储抽象 |
| `infrastructure -> domain/application` | 基础设施层向上提供实现，不反向驱动领域规则 |
| `domain` | 不直接依赖 controller、ORM 实体实现或第三方 SDK |

### Entity / 仓储放置约定

| 类型 | 推荐位置 |
| --- | --- |
| 数据库基础设施配置 | `src/core/database` |
| 简单 CRUD 模块的实体 | `src/modules/<feature>/entities` |
| `recruitment` 领域实体 / 值对象 | `src/modules/recruitment/domain` |
| `recruitment` 仓储接口 | `src/modules/recruitment/domain/repository` |
| `recruitment` 数据库实现 | `src/modules/recruitment/infrastructure/persistence` |
| `recruitment` 仓储实现 | `src/modules/recruitment/infrastructure/repositories` |
| 跨模块稳定复用枚举/DTO/工具 | `src/common` |

规则只有一条：**业务对象默认跟着 owning feature 或 owning domain 走，不跟着 `database`、`common` 或工具目录走。**

## 常用命令

| 目的 | 命令 |
| --- | --- |
| 安装依赖 | `pnpm install` |
| 启动 | `pnpm start` |
| 开发模式 | `pnpm start:dev` |
| 构建 | `pnpm build` |
| Lint | `pnpm lint` |
| 格式化 | `pnpm format` |
| 单测 | `pnpm test` |
| e2e | `pnpm test:e2e` |
| 覆盖率 | `pnpm test:cov` |
| 重置本地数据库 | `pnpm db:reset` |

## 数据库迁移

项目使用 MikroORM Migrations 管理数据库 schema 变更。

### 快速使用

```bash
# 创建新的 migration
pnpm migration:create

# 执行 migrations
pnpm migration:up

# 回滚 migration
pnpm migration:down

# 查看 migration 状态
pnpm migration:status
```

### Migration 命令

| 命令 | 说明 |
| --- | --- |
| `pnpm migration:create` | 创建新的 migration（自动检测实体变更） |
| `pnpm migration:up` | 执行所有 pending migrations |
| `pnpm migration:down` | 回滚最后一个 migration |
| `pnpm migration:status` | 查看 migration 状态 |
| `pnpm migration:fresh` | 重置数据库并重新执行所有 migrations |

### Migration 工作流

1. **修改实体**：在 `src/modules/*/infrastructure/persistence/entities/` 中修改实体定义
2. **创建 migration**：运行 `pnpm migration:create`，MikroORM 会自动检测变更并生成 migration 文件
3. **审查 migration**：检查生成的 migration 文件（位于 `migrations/` 目录）
4. **执行 migration**：运行 `pnpm migration:up` 应用变更到数据库
5. **提交代码**：将 migration 文件和实体变更一起提交到 Git

### Migration 最佳实践

- **命名清晰**：创建 migration 时使用 `--name` 参数，如 `pnpm migration:create --name add-user-index`
- **审查 SQL**：执行前仔细审查生成的 SQL 语句
- **测试回滚**：在开发环境测试 `migration:down` 确保可以回滚
- **数据安全**：生产环境执行前先备份数据库
- **版本控制**：所有 migration 文件必须提交到 Git

### Migration 文件位置

```
backend/
└── migrations/
    ├── 20260516102026-migration.ts
    └── ...
```

### 注意事项

- 不要手动修改已执行的 migration 文件
- 生产环境部署前必须先执行 migrations
- 修改实体后必须创建对应的 migration
- Migration 文件使用时间戳命名，确保执行顺序

## BaseEntity 基础实体

项目使用 `BaseEntity` 抽象类统一管理所有实体的基础字段。

### 基础字段

所有继承 `BaseEntity` 的实体自动获得以下字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` (UUID) | 主键，自动生成 |
| `createdAt` | `Date` | 创建时间，自动填充 |
| `updatedAt` | `Date` | 更新时间，自动更新 |
| `deletedAt` | `Date?` | 软删除时间，可为空 |

### 使用示例

```typescript
import { Entity, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '../../../../../common/entities/base.entity';

@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity {
  @Property()
  name: string = '';

  @Property()
  email: string = '';
}
```

### 软删除使用

```typescript
// 软删除：设置 deletedAt 字段
entity.deletedAt = new Date();
await em.flush();

// 查询时过滤已删除记录
const activeUsers = await em.find(UserEntity, { 
  deletedAt: null 
});

// 查询所有记录（包括已删除）
const allUsers = await em.find(UserEntity, {});
```

### 注意事项

- 所有新实体都应该继承 `BaseEntity`
- 不要在实体中重复定义基础字段
- 软删除需要手动过滤，不会自动过滤
- 创建实体时需要显式提供 `createdAt` 和 `updatedAt` 字段

## 开发流程

| 步骤 | 说明 |
| --- | --- |
| 1 | 进入 `backend/` 目录执行命令 |
| 2 | 改动模块代码时，优先保持领域边界清晰 |
| 3 | 改动实体、模块装配或依赖注入后，至少运行 `pnpm build` 和 `pnpm test` |
| 4 | 涉及启动流程、数据库装配、上传解析链路时，再运行 `pnpm start` 做启动验证 |

## 后端架构事实来源

| 来源 | 说明 |
| --- | --- |
| `openspec/changes/refactor-recruitment-layered-architecture/proposal.md` | 描述招聘领域收敛到 `recruitment` 根模块的目标与影响 |
| `openspec/changes/refactor-recruitment-layered-architecture/design.md` | 描述四层结构、单向依赖与招聘领域命名收敛决策 |
| `openspec/changes/refactor-recruitment-layered-architecture/specs/backend-architecture/spec.md` | 描述招聘领域复杂模块必须采用四层结构的架构约束 |

## 当前后端关注点

| 主题 | 说明 |
| --- | --- |
| 数据存储 | 当前使用 `sql.js`，数据库文件默认是 `data.sqlite` |
| 实体注册 | 当前由 `src/core/database/typeorm.config.ts` 统一注册 |
| API 入口 | 当前模块通过 `src/app.module.ts` 装配 |
| 当前实现状态 | 招聘相关能力已收敛到 `modules/recruitment`；README 记录的是当前落地结构与后续演进约束 |

## 什么时候不要抽公共目录

| 情况 | 建议 |
| --- | --- |
| 只被一个模块使用 | 留在该 feature 或 domain 内部 |
| 复用还不稳定 | 先允许重复，不急着抽 `common` |
| 依赖配置、数据库、外部服务 | 做成明确的 service/module 或 infrastructure adapter，不要塞工具函数目录 |
| 带明显业务语义 | 优先放回对应 `modules/<feature>` 或 `modules/<domain>`，不要为省路径塞进 `common` |

## 变更前检查

| 检查项 | 要点 |
| --- | --- |
| 是否属于业务模块 | 放 `modules/` |
| 是否属于系统基础设施 | 放 `core/` |
| 是否真的稳定跨模块复用且业务无关 | 才考虑 `common/` |
| 是否属于后台任务或异步消费 | 放 `jobs/` |
| 是否引入复杂招聘能力 | 优先按 `recruitment/api/application/domain/infrastructure` 落目录 |
