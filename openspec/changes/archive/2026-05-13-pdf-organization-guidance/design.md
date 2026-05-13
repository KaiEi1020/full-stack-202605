## Context

当前 backend 已经采用以 feature 为中心的 NestJS 组织方式：根模块负责组装，跨 feature 共享基础设施通过独立 module 暴露，具体业务能力则按 feature 拆分。用户当前要补充的是一条面向 PDF 能力的落位规则：当能力只有一个方法时，不要机械地抽象成全局 utils，也不要机械地创建 Nest module，而是根据依赖复杂度、复用范围和可替换性做渐进式选择。

这项变更同时要求把判断标准写入 `backend/README.md`，使其不仅存在于一次性的讨论中，也能成为后续实现和评审的公开约束。

## Goals / Non-Goals

**Goals:**
- 为 backend 中的 PDF 能力提供明确、一致、可执行的落位判断标准。
- 让 README 能说明何时使用普通 helper/类，何时升级为 Nest service/module。
- 明确当前 backend 在什么条件下才应新增全局公共 helper/utils，而不是默认创建公共目录。
- 提供一个样板案例，降低后续实现时的歧义。
- 保持与当前仓库现有 feature-oriented NestJS 结构一致，避免无约束地引入新的全局 utils 约定。
- 让该判断标准能够被 OpenSpec 规范化，作为后续实现和评审依据。

**Non-Goals:**
- 不在本变更中引入实际 PDF 生成功能。
- 不在本变更中改造现有 backend 模块结构。
- 不新增运行时依赖、外部服务接入或新的 API。

## Decisions

### 决策一：将 PDF 落位标准定义为架构能力约束，而不是单次实现备注
- 选择：通过新增 `pdf-organization-guidance` capability，并修改 `backend-architecture` capability 表达该规则。
- 原因：用户要的不只是本次回答，而是后续实现时可复用的判断标准；仅写在聊天记录里不可追踪，也无法作为规范验证依据。
- 备选方案：只更新 README，不写 spec。
- 不采用原因：README 能提供可见性，但不能形成结构化规范，后续难以在 OpenSpec 流程中引用。

### 决策二：README 只记录判断标准，不复制完整设计推导
- 选择：在 `backend/README.md` 中增加简洁规则与判断表。
- 原因：README 需要便于快速查阅，适合沉淀“如何判断”；更长的背景和原因放在 proposal/design/spec 更合适。
- 备选方案：把完整背景、风险与架构讨论全部写进 README。
- 不采用原因：会让 README 冗长，降低可维护性。

### 决策三：规范要求优先贴近 feature 放置，而不是创建全局 utils 桶
- 选择：当 PDF 能力是单一纯逻辑时，要求优先放在实际使用它的 feature 内；当存在注入依赖、跨 feature 复用或可替换实现需求时，再升级为独立 module。
- 原因：当前 backend 没有统一的全局 `utils/helpers/common` 约定，而已有代码更接近 feature-oriented 结构。
- 备选方案：统一要求所有 PDF 相关代码都建成 `pdf.module.ts`。
- 不采用原因：对于单一纯方法场景会过度设计，增加 provider/module 装配成本。

### 决策四：只有在形成稳定跨 feature 复用后，才允许新增全局公共 helper/utils
- 选择：新增公共 helper/utils 必须同时满足“至少两个 feature 复用”“逻辑保持纯粹”“不需要 Nest 注入”“命名与边界稳定”这类条件；否则优先保留在 feature 内。
- 原因：当前仓库还没有公共 helper/utils 层，过早建立公共目录容易把尚未稳定的业务逻辑错误上提，形成难以收敛的杂项桶。
- 备选方案：先创建 `common/utils` 或 `shared/helpers` 目录，后续逐步填充。
- 不采用原因：会先有目录、后找用途，容易弱化 feature 边界。

### 决策五：在 README 中提供样板案例，而不是只给抽象原则
- 选择：增加一个最小样板案例，对比 feature 内 helper 与可提取公共 helper 的推荐写法。
- 原因：判断标准如果没有例子，团队在落地时仍容易回到主观判断。
- 备选方案：只保留文字规则和表格。
- 不采用原因：缺少可模仿的结构示例，规范的执行一致性较弱。

- [样板案例被误读为强制目录结构] → 在 README 中明确样板仅用于说明判断与放置方式，不代表必须预先创建公共目录。
- [新增公共 helper 的门槛过高导致重复代码短期存在] → 接受少量重复，优先避免错误抽象；待出现稳定复用后再上提。

## Risks / Trade-offs

- [规则偏原则化，边界场景可能仍需判断] → 通过在 README 中加入表格化判断标准，并在 spec 中把“单一纯逻辑”和“有注入依赖/跨 feature 复用”场景写成明确要求降低歧义。
- [README 与 spec 未来可能失去同步] → 通过同一 change 同时更新 README 和 spec，后续若调整规则必须同时修改两处。
- [只针对 PDF 可能显得过窄] → 这是有意取舍；本次先解决用户明确提出的 PDF 场景，不扩展成全仓库通用抽象策略。