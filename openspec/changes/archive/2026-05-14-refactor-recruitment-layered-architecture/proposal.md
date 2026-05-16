## Why

当前招聘相关能力分散在 `candidate`、`resume-upload`、`screening` 等模块中，同时项目内已经存在 `recruitment` 模块，导致领域边界不清、依赖方向混乱、后续扩展成本高。现在需要以招聘领域为边界完成一次收敛式重构，将相关能力统一纳入 `recruitment` 领域模块，并建立清晰的四层结构，降低耦合并为后续演进提供稳定骨架。

## What Changes

- 将现有 `candidate`、`resume-upload`、`screening` 模块识别为 `recruitment` 领域的一部分，统一迁移到 `recruitment` 领域根模块下。
- 在 `recruitment` 领域内建立 `api`、`application`、`domain`、`infrastructure` 四层结构，并重新组织控制器、用例服务、领域对象、仓储接口与基础设施实现。
- 移除 `recruitment/applications` 目录命名，避免与 `application` 分层名称混淆；现有 `applications` 相关代码统一重命名为更符合业务语义的 `job-applications`。
- 调整 Nest 模块装配方式，由领域根模块集中导出招聘相关能力，减少横向模块直接耦合。
- 规范招聘领域内部依赖方向：接口层依赖应用层，应用层依赖领域层抽象，基础设施层提供技术实现。
- **BREAKING**：后端源码目录结构、模块导入路径、部分 provider 注册位置、`applications` 相关命名与测试引用路径将发生调整。

## Capabilities

### New Capabilities
- `recruitment-layered-architecture`: 定义招聘领域模块的四层分层结构、职责边界与模块装配方式。

### Modified Capabilities
- `resume-rest-api`: 将现有简历上传与候选人相关 REST 能力迁移到招聘领域统一接口结构下，但保持对外行为连续。
- `resume-ai-scoring`: 将筛选与评分编排能力迁移到招聘领域应用层与基础设施层边界内。
- `backend-architecture`: 调整后端模块组织方式，使招聘相关模块遵循领域根模块 + 四层架构模式。

## Impact

- 影响代码：`backend/src/modules/candidate/**`、`backend/src/modules/resume-upload/**`、`backend/src/modules/screening/**`、`backend/src/modules/recruitment/**`、`backend/src/app.module.ts` 及相关测试文件。
- 影响 API：接口路径原则上保持兼容，但控制器归属、DTO 位置、内部装配方式会调整。
- 影响依赖：Nest 模块 imports/providers/exports、TypeORM 实体注册、SSE/存储/大模型等招聘相关依赖接入方式需同步梳理。
- 影响系统：后端招聘领域的代码组织、测试结构与后续扩展模式将统一到新的分层架构。
