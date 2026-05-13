## Why

当前将 `CandidateStatus`、`JobStatus`、`ParseStatus` 这类业务状态枚举放在 `backend/src/core/database/` 下，会模糊领域概念与基础设施概念的边界。现在调整位置，可以让目录语义与模块职责保持一致，避免后续继续把业务语义沉入数据库层。

## What Changes

- 将候选人、简历解析、岗位等业务状态枚举从 `backend/src/core/database/` 迁移到更贴近业务语义的模块目录或共享业务类型目录。
- 更新实体、DTO、service、orchestrator 等对这些枚举的 import 路径，保证运行行为不变。
- 收敛 `core/database/` 的职责，仅保留数据库连接、配置、模块装配等基础设施内容。
- 统一后续业务状态类型的归类规则，避免新增业务枚举继续放入数据库基础设施目录。

## Capabilities

### New Capabilities
- 无

### Modified Capabilities
- `backend-architecture`: 调整后端架构约束，明确业务状态枚举不应放在 `core/database`，应归属业务模块或共享业务类型目录
- `persistence-model`: 调整持久化模型约束，明确数据库层可以引用业务状态枚举，但不负责承载业务状态定义

## Impact

- 受影响代码主要位于 `backend/src/core/database/`、`backend/src/modules/candidate/`、`backend/src/modules/resume-upload/`、`backend/src/modules/screening/`。
- 不改变数据库字段值、HTTP API 语义或外部依赖。
- 主要影响源码目录语义、import 路径和后续代码归类约定。
- 需要通过构建或测试验证迁移后引用关系和 Nest/TypeORM 运行行为保持正常。
