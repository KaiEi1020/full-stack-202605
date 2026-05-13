# Backend

这个目录是当前项目的后端服务。

## 目录结构

```text
backend/
├── src/
│   ├── core/
│   │   ├── bigmodel/
│   │   ├── database/
│   │   ├── pdf/
│   │   ├── sse/
│   │   └── storage/
│   ├── modules/
│   │   ├── candidate/
│   │   ├── resume-upload/
│   │   ├── screening/
│   │   └── user/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
│
├── test/
├── data.sqlite
├── schema.gql
└── package.json
```

## 模块说明

| 模块 | 作用 |
| --- | --- |
| `core/database` | 数据库配置、TypeORM 装配、数据库基础设施 |
| `core/storage` | 文件存储能力 |
| `core/pdf` | PDF 解析能力 |
| `core/sse` | SSE 事件推送 |
| `core/bigmodel` | 大模型相关能力 |
| `modules/user` | 用户管理与注册 |
| `modules/candidate` | 候选人、简历列表、职位要求、评分相关能力 |
| `modules/resume-upload` | 简历上传入口 |
| `modules/screening` | 简历解析、提取、评分编排流程 |

## 结构约定

### 顶层约定

| 目录 | 约定 |
| --- | --- |
| `src/core` | 放系统级基础设施能力，不放业务模块代码 |
| `src/modules` | 放业务模块，按 feature 组织 |
| `src/shared` | 仅在明确跨模块稳定复用时才创建和使用 |

### 模块内部约定

支持两种风格并存：

| 场景 | 推荐结构 |
| --- | --- |
| 简单 CRUD 模块 | `controller + service + dto + entities` |
| 复杂业务模块 | `application + domain + infrastructure` |

### Entity 放置约定

| 类型 | 推荐位置 |
| --- | --- |
| 数据库基础设施 | `src/core/database` |
| 简单 CRUD 模块的实体 | `src/modules/<feature>/entities` |
| 复杂模块的 ORM Entity | `src/modules/<feature>/infrastructure/persistence/entities` |
| 领域对象 / 仓储接口 | `src/modules/<feature>/domain` |

规则只有一条：**Entity 默认跟着 owning feature 走，不跟着 `database` 目录走。**

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

## 开发流程

| 步骤 | 说明 |
| --- | --- |
| 1 | 进入 `backend/` 目录执行命令 |
| 2 | 改动模块代码时，优先保持 feature 边界清晰 |
| 3 | 改动实体、模块装配或依赖注入后，至少运行 `pnpm build` 和 `pnpm test` |
| 4 | 涉及启动流程、数据库装配、上传解析链路时，再运行 `pnpm start` 做启动验证 |

## 当前后端关注点

| 主题 | 说明 |
| --- | --- |
| 数据存储 | 当前使用 `sql.js`，数据库文件默认是 `data.sqlite` |
| 实体注册 | 由 `src/core/database/typeorm.config.ts` 统一注册 |
| API 入口 | 模块通过 `src/app.module.ts` 装配 |
| 代码组织 | 优先按 feature 组织，而不是堆公共工具目录 |

## 什么时候不要抽公共目录

| 情况 | 建议 |
| --- | --- |
| 只被一个模块使用 | 留在该 feature 内部 |
| 复用还不稳定 | 先允许重复，不急着抽 `shared` |
| 依赖配置、数据库、外部服务 | 做成明确的 service/module，不要塞工具函数目录 |

## 变更前检查

| 检查项 | 要点 |
| --- | --- |
| 是否属于业务模块 | 放 `modules/` |
| 是否属于系统基础设施 | 放 `core/` |
| 是否真的跨模块稳定复用 | 才考虑 `shared/` |
| 是否引入实体 | 先确定 owning feature，再落目录 |
