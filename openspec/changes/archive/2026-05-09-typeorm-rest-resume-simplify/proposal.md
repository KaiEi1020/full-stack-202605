## Why

当前后端同时承载 Prisma、GraphQL 与较细粒度的简历数据表设计，导致技术栈分散、接口风格不统一、简历领域建模过度复杂。现在需要统一为 TypeORM + SQLite + RESTful 风格，并将简历数据收敛为单表模型，以降低维护成本并让复杂模块与简单模块采用更匹配的架构方式。

## What Changes

- **BREAKING** 将后端 API 从 GraphQL 接口切换为 RESTful HTTP 接口，移除现有 GraphQL 查询与变更入口。
- **BREAKING** 将持久化方案从 Prisma 切换为 TypeORM，数据库仍使用 SQLite。
- **BREAKING** 重构简历领域的数据模型，将多表结构收敛为单一简历表，所有简历字段落在该表中。
- 新增简历 AI 打分能力，支持技能匹配度、经验相关性、教育背景契合度等多维度子评分，并生成综合评分结果。
- 新增 AI 评语输出，要求系统生成一段概述候选人优势与不足的说明文本。
- 新增评分结果可视化展示能力，支持以雷达图、柱状图或环形进度条等图表方式呈现评分结果。
- 为复杂业务模块保留 DDD 分层与边界，继续通过应用层与基础设施层解耦。
- 为简单业务模块采用更直接的 CRUD 组织方式，减少不必要的分层复杂度。
- 调整后端模块装配方式，使 REST 控制器、TypeORM 实体与模块架构保持一致。

## Capabilities

### New Capabilities
- `resume-rest-api`: 定义基于 RESTful 风格的简历读写接口与返回行为
- `resume-single-table-model`: 定义基于 SQLite 与 TypeORM 的简历单表持久化模型
- `resume-ai-scoring`: 定义简历 AI 多维度评分、AI 评语与评分结果结构
- `resume-score-visualization`: 定义评分结果的可视化展示形式与展示要求
- `mixed-module-architecture`: 定义复杂模块使用 DDD、简单模块使用 CRUD 的后端组织规则

### Modified Capabilities
- `graphql-api`: 移除 GraphQL 端点及相关查询/变更要求，迁移为 REST 接口要求
- `persistence-model`: 将持久化定义来源与数据访问实现从 Prisma 改为 TypeORM
- `backend-architecture`: 调整后端装配方式以匹配控制器 + 服务 + 仓储/实体的新结构

## Impact

- 影响 `backend/` 中的模块装配、接口层、应用层、基础设施层与数据库访问代码
- 影响后端依赖，移除 Prisma 相关依赖并引入 TypeORM 相关依赖
- 影响前端或其他调用方的接口访问方式，需要从 GraphQL 请求迁移为 REST 请求
- 影响 SQLite 数据结构与迁移策略，需从现有多表简历结构迁移到单表简历结构
- 影响 AI 打分结果的数据结构、服务编排与评分结果展示页面
