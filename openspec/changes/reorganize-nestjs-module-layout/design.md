## Context

当前后端是单体 NestJS 应用，顶层 `src/` 下同时放置了业务模块和基础设施模块；与此同时，`user` 模块已经出现 `application/domain/infrastructure` 分层迹象。用户希望后端既能支持未来商品、下单等复杂领域模块采用 DDD 分层，也允许一些逻辑简单的模块继续使用传统 CRUD 结构，因此目录方案不能强制所有模块走同一种内部组织方式。

本次设计要解决的是“顶层如何归类”和“模块内部允许哪些模式并存”，而不是一次性把所有模块重构为纯 DDD。

## Goals / Non-Goals

**Goals:**
- 为单体 NestJS 项目建立清晰的顶层目录边界。
- 明确业务模块统一进入 `src/modules/`，基础设施能力统一进入 `src/core/`。
- 支持模块内部采用混合模式：复杂模块使用 DDD 分层，简单模块使用直接 CRUD。
- 为未来复杂领域模块扩展提供稳定约定，避免后续重复争论目录规范。
- 在迁移过程中保持现有 API 行为与依赖注入行为不变。

**Non-Goals:**
- 不要求本次把所有现有模块都重构成 DDD。
- 不引入新的外部依赖或 monorepo 结构。
- 不在本次目录调整中统一所有命名风格、DTO 位置或 path alias。
- 不改变现有业务规则、数据库模型或对外接口契约。

## Decisions

### 1. 顶层采用 `modules + core + shared` 结构

- `src/modules/` 承载业务能力模块，例如 `user`、`candidate`、`resume-upload`、`screening`。
- `src/core/` 承载系统级基础设施模块，例如 `database`、`storage`、`pdf`、`sse`、`bigmodel`。
- `src/shared/` 只承载真正跨模块复用且不绑定具体业务的类型、工具和基础 DTO；没有明确复用价值时不强行抽取。

**原因：** 这能把“业务归属”和“基础设施归属”从顶层直接区分出来，同时保留单体项目的开发效率。

**备选方案：**
- 保持扁平结构：改动小，但根目录会继续膨胀。
- 直接引入 `domains/infra` 的重 DDD 结构：长期更强，但当前迁移成本过高。

### 2. 业务模块内部允许两种合法模式并存

- 复杂模块采用 DDD 分层，例如 `controller -> application -> domain -> infrastructure`。
- 简单模块采用 CRUD 分层，例如 `controller -> service -> repository/entity`。
- 是否属于复杂模块，以是否存在明显领域规则、跨聚合协作、外部适配器编排、状态流转复杂度为判断依据，而不是以模块大小或文件数量决定。

**原因：** 统一顶层边界比统一所有内部细节更重要；强迫简单模块套 DDD 会造成样板代码膨胀，而复杂模块不用 DDD 又会让业务规则分散。

**备选方案：**
- 全部模块统一 DDD：一致性高，但过度设计。
- 全部模块统一 CRUD：上手简单，但无法支撑复杂领域演进。

### 3. 迁移以目录归类为主，不同步引入 path alias

- 优先通过移动目录并修正相对 import 完成迁移。
- 暂不新增 `@modules/*`、`@core/*` 等 alias。

**原因：** 避免把目录重组与编译配置、Jest 配置、Nest 构建配置调整耦合在一次改动中，降低回归面。

### 4. 现有模块按职责归类，而不是按技术类型归类

- `user`、`candidate`、`resume-upload`、`screening` 归入 `modules/`。
- `database`、`storage`、`pdf`、`sse`、`bigmodel` 归入 `core/`。
- 若未来出现 `product`、`order` 等复杂领域模块，默认放在 `modules/` 下，并允许模块内部使用 `application/domain/infrastructure`。

**原因：** 顶层目录首先表达业务边界与系统边界，而不是表达“controller/service/entity”这种实现细节。

## Risks / Trade-offs

- [批量移动目录导致 import 路径易错] → 通过集中更新 `app.module.ts`、逐模块修正相对路径、执行构建与测试降低风险
- [团队对“何时用 DDD、何时用 CRUD”理解不一致] → 在 spec 中明确复杂模块与简单模块的判定和允许结构
- [`shared/` 被滥用为杂物目录] → 仅在存在跨模块复用且不依赖业务语义时才允许放入 `shared/`
- [现有模块内部风格仍不统一] → 本次只统一顶层边界，后续按模块复杂度逐步整理内部结构
