## Why

当前 NestJS 后端已经是单体应用，`backend/src/app.module.ts` 直接挂载了多个业务与基础设施模块，而 `user` 模块内部又已经出现 `application/domain/infrastructure` 分层。继续维持完全扁平的 `src` 结构会让根目录不断膨胀，增加定位业务边界、基础设施边界和共享能力边界的成本。

现在推进目录归类，能够在不改变业务行为的前提下，为后续模块扩展建立稳定的结构约定，避免项目继续以两套组织方式并存。

## What Changes

- 将当前单体 NestJS 项目的顶层目录从完全扁平结构调整为分层归类结构。
- 新增 `src/modules/` 作为业务模块归属目录，承载 `user`、`candidate`、`resume-upload`、`screening` 等业务能力。
- 新增 `src/core/` 作为系统级基础设施目录，承载 `database`、`storage`、`pdf`、`sse`、`bigmodel` 等支撑能力。
- 视实际需要新增 `src/shared/`，承载不依赖具体业务模块的共享类型、DTO、工具函数或常量。
- 在业务模块层面明确采用混合模式：复杂模块允许使用 DDD 分层，简单模块允许保留 controller/service/repository 风格的直接 CRUD 结构。
- 为未来的复杂领域模块（如商品、订单）保留向 `application/domain/infrastructure` 演进的目录约定。
- 更新模块导入路径与应用装配路径，保证目录迁移后依赖注入和运行行为保持不变。
- 明确后续新增模块的归类规则，避免继续将业务模块与基础设施模块混放在 `src/` 根目录。

## Capabilities

### New Capabilities
- `nestjs-module-layout`: 定义单体 NestJS 项目的目录归类规范，明确业务模块、核心基础设施与共享代码的顶层边界，并支持复杂模块走 DDD、简单模块走 CRUD

### Modified Capabilities
- `backend-architecture`: 调整后端架构要求，使其明确区分单体应用中的业务模块目录与基础设施目录

## Impact

- 受影响代码主要位于 `backend/src/` 下的现有模块目录与 `backend/src/app.module.ts`。
- 不引入新的外部依赖，也不改变对外 API 行为。
- 主要影响开发者的目录导航、模块归类方式与 import 路径。
- 需要通过构建、单元测试和服务启动验证迁移后模块装配仍然正常。
