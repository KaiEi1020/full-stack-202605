## Why

当前 backend 需要明确 PDF 能力在 NestJS 项目中的落位方式，避免在只有单一方法时过早引入 module/依赖注入，也避免把后续可能扩展的能力直接塞进全局 utils。现在补充这份规范，可以让后续实现和代码评审有一致判断标准，并把标准沉淀到 README 方便团队查阅。

## What Changes

- 新增一份关于 PDF 能力组织方式的变更说明，明确何时使用普通 helper/类，何时升级为 Nest service/module。
- 补充当前 backend 是否需要引入全局公共 helper/utils 目录的判断逻辑，并给出不应新增与可以新增的边界。
- 在 backend README 中补充 PDF 能力的“判断标准”以及公共 helper/utils 的引入标准，作为实现和评审时的落位指南。
- 提供一个样板案例，说明 feature 内 helper 与全局公共 helper 的推荐写法和放置方式。
- 约束后续 PDF 相关实现优先贴近业务 feature 放置，只有在存在注入依赖、跨 feature 复用或可替换实现需求时再抽为独立 module。

## Capabilities

### New Capabilities
- `pdf-organization-guidance`: 定义 backend 中 PDF 能力的落位规则、公共 helper/utils 的引入边界与 README 可见的判断标准

### Modified Capabilities
- `backend-architecture`: 增加 PDF 相关实现应如何在 feature helper 与 Nest module 之间选择的要求

## Impact

- 影响文档：`backend/README.md`
- 影响规范：`openspec/specs/pdf-organization-guidance/spec.md`、`openspec/changes/pdf-organization-guidance/specs/backend-architecture/spec.md`
- 影响后续 backend PDF 相关代码组织，以及是否新增全局公共 helper/utils 的决策方式
- 本变更不引入新的运行时依赖或 API
