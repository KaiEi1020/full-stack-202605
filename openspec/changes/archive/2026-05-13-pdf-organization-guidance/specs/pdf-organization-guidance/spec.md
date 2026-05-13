## ADDED Requirements

### Requirement: PDF 能力必须根据依赖复杂度选择组织方式
系统 MUST 在 backend 中根据 PDF 能力的依赖复杂度、复用范围与可替换需求，选择普通 helper/类或 Nest service/module 的组织方式，而不是机械地统一采用单一模式。

#### Scenario: 使用单一纯逻辑 PDF 能力
- **WHEN** 某个 PDF 能力仅包含输入到输出的纯逻辑处理，且不依赖配置、数据库、对象存储、消息队列、日志适配器或第三方客户端
- **THEN** 系统必须允许该能力作为贴近业务 feature 的普通 helper 或类实现，而不要求创建独立 Nest module

#### Scenario: 使用具备注入依赖的 PDF 能力
- **WHEN** 某个 PDF 能力需要注入配置、持久化、对象存储、队列、日志或外部 PDF SDK 等依赖
- **THEN** 系统必须将该能力实现为 Nest service，并允许其通过独立 module 暴露和装配

### Requirement: PDF 能力与公共 helper 的判断标准必须在 README 中可见
系统 MUST 在 backend README 中提供 PDF 能力的判断标准，以及当前是否应新增全局公共 helper/utils 的判断标准，使实现者与评审者可以直接依据文档判断应采用 feature 内 helper/类、全局公共 helper，还是 Nest service/module。

#### Scenario: 查阅 PDF 组织规范
- **WHEN** 开发者查阅 `backend/README.md` 以确定新的 PDF 能力应如何落位
- **THEN** README 必须给出明确的判断标准，并覆盖单一纯逻辑、依赖注入、跨 feature 复用与可替换实现等场景

#### Scenario: 判断是否新增公共 helper 目录
- **WHEN** 开发者评估某段纯逻辑是否应从 feature 内上提为全局公共 helper 或 utils
- **THEN** README 必须说明只有在逻辑被多个 feature 稳定复用、无需 Nest 注入且边界稳定时，系统才允许新增公共 helper 或 utils

### Requirement: README 必须提供可参考的组织样板案例
系统 MUST 在 backend README 中提供至少一个样板案例，用于说明 feature 内 helper 与全局公共 helper 的推荐放置方式和代码形态。

#### Scenario: 参考组织样板
- **WHEN** 开发者需要新增一个与 PDF 类似的纯逻辑能力
- **THEN** README 必须提供可直接参考的样板案例，展示何时保留在 feature 内、何时可抽取为公共 helper
