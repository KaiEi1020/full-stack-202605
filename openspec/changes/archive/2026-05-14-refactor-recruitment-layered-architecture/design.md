## Context

当前后端与招聘相关的能力分散在 `candidate`、`resume-upload`、`screening` 以及现有 `recruitment/applications` 等目录中，既有按功能拆分，也有按流程拆分，导致领域边界与依赖方向不稳定。与此同时，代码中已经存在 `recruitment` 相关模块与 `applications` 业务目录，名称上又与计划中的 `application` 分层高度相似，容易造成“业务对象集合”与“应用层”语义混淆。

这次变更不是单纯的目录搬迁，而是一次招聘领域边界收敛：将候选人、简历上传、筛选评分等能力统一收编到 `recruitment` 领域模块内，并按 `api`、`application`、`domain`、`infrastructure` 四层重新组织。目标是在不破坏现有对外行为的前提下，统一模块装配方式、明确依赖方向，并为后续新增职位、投递、筛选等子域能力提供稳定骨架。

## Goals / Non-Goals

**Goals:**
- 将 `candidate`、`resume-upload`、`screening` 统一重构到 `recruitment` 领域模块中。
- 在 `recruitment` 下建立 `api`、`application`、`domain`、`infrastructure` 四层结构，并明确依赖方向。
- 去掉 `recruitment/applications` 目录命名，将现有业务概念重命名为更明确的 `job-applications`。
- 保持现有 REST、SSE、评分编排等核心行为连续，避免重构期间引入无关业务变化。
- 为 Nest 模块、Provider、TypeORM 实体与仓储实现建立统一装配入口。

**Non-Goals:**
- 不在本次设计中重做招聘业务规则本身，如评分规则、状态机规则或数据库模型语义。
- 不主动新增新的对外业务接口，只允许为兼容迁移做必要的内部重组。
- 不要求整个后端所有模块都切换到四层结构，本次仅约束招聘领域。

## Decisions

### 决策一：以 `recruitment` 作为唯一招聘领域根模块
- 选择：将 `candidate`、`resume-upload`、`screening` 的实现逐步迁移到 `recruitment` 下，由 `recruitment.module.ts` 统一装配。
- 原因：这些模块本质上共享同一领域对象与流程链路，继续平级拆分会让跨模块调用越来越重。
- 备选方案：保留原模块，仅通过 facade 或 shared service 进行聚合。
- 不采用原因：只能缓解调用关系，不能真正收敛目录结构与依赖边界。

### 决策二：采用四层结构并强制单向依赖
- 选择：`api -> application -> domain`，`infrastructure` 仅向上提供实现，不允许领域层反向依赖控制器、ORM 或第三方 SDK。
- 原因：招聘流程涉及上传、解析、评分、事件推送、状态变更等跨技术细节，必须把编排逻辑与技术实现拆开。
- 备选方案：继续使用按模块自由组织的 Nest service/controller 结构。
- 不采用原因：随着流程增多，service 会同时承担接口、编排、规则与持久化职责，难以维护。

### 决策三：将 `applications` 业务目录重命名为 `job-applications`
- 选择：移除 `recruitment/applications` 命名，统一改成 `job-applications`，用于表达“职位投递/申请”这一业务概念。
- 原因：`applications` 与分层中的 `application` 极易混淆，阅读时无法快速判断是在说用例层还是投递业务。
- 备选方案：保留 `applications` 并依赖上下文区分含义。
- 不采用原因：会持续制造歧义，尤其在 import 路径、模块名、service 命名中最明显。

### 决策四：对外接口优先保持兼容，内部重构优先完成归位
- 选择：优先调整控制器归属、服务职责与依赖注入位置，尽量保持既有 HTTP 路径、SSE 事件语义与返回结构稳定。
- 原因：本次目标是架构重构，不是业务重设计；接口兼容可降低迁移风险。
- 备选方案：在重构同时统一重命名全部接口与 DTO。
- 不采用原因：会把架构迁移与 API 变更耦合，放大测试与回滚成本。

### 决策五：仓储接口下沉到领域层，TypeORM 实现放到基础设施层
- 选择：在 `domain/repository` 定义抽象接口，在 `infrastructure/persistence/repository` 提供 TypeORM 实现。
- 原因：筛选、上传、候选人状态等用例需要围绕领域语义协作，而不应直接依赖 ORM 细节。
- 备选方案：应用层直接注入 TypeORM Repository。
- 不采用原因：会把 ORM 能力泄漏到用例层，后续替换实现或抽离规则都更困难。

## Risks / Trade-offs

- [迁移期间 import 路径大面积变化] → 先建立新目录与模块装配，再分批迁移实现与测试，减少一次性改动面。
- [接口兼容性被目录重构意外破坏] → 保持 controller 路由与 DTO 契约优先不变，用测试覆盖关键 HTTP 与 SSE 行为。
- [领域边界切分不彻底，出现 application 层继续承载业务规则] → 在设计上明确 application 负责编排，规则沉到 domain service 或 entity/value object。
- [`job-applications` 重命名影响较多引用] → 统一在本次重构中完成命名替换，避免后续再经历第二次语义迁移。
- [现有 `recruitment` 模块与新根模块职责重叠] → 在迁移计划中先梳理已有 `recruitment` 子目录职责，再决定并入、替换或拆除。

## Migration Plan

1. 盘点现有 `candidate`、`resume-upload`、`screening`、`recruitment/applications` 与已存在 `recruitment` 子模块的职责和依赖。
2. 在 `recruitment` 下建立四层目录骨架与领域根模块，确定 `job-applications` 命名落点。
3. 先迁移 controller 与 application service 的装配关系，再迁移领域对象、仓储接口与基础设施实现。
4. 将旧模块中的 provider、DTO、实体注册与测试引用逐步切换到新路径。
5. 保留必要兼容导出直到所有内部引用迁移完成，然后删除旧目录与旧模块装配。
6. 通过单元测试、e2e 与关键路径联调验证行为一致后完成收口。

## Open Questions

- 现有 `recruitment` 目录下除 `applications` 外的实现，哪些应该并入新的四层结构，哪些应拆成独立子域。
- `candidate` 与 `job-applications` 的聚合根边界最终是拆分建模还是共享同一主实体。
- 是否需要在本次重构中同步重命名 Nest module/provider/class 名称，以彻底消除历史语义残留。
