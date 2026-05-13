## Context

当前后端已经采用 REST 风格接口，但部分请求模型文件仍沿用 `*.input.ts` 文件名和 `*Input` 类名。这套命名来自 GraphQL code-first 语义，在纯 REST 控制器场景下会让代码表达不够直接，也会让 DTO 目录和命名风格持续混用。

## Goals / Non-Goals

**Goals:**
- 将当前 REST 请求模型统一重命名为 DTO 风格。
- 保持请求结构、控制器签名和运行行为不变。
- 统一 user 和 candidate 相关模块里的命名风格。
- 让后续新增 REST 请求模型默认沿用 `*.dto.ts` 和 `*Dto`。

**Non-Goals:**
- 不调整接口字段语义。
- 不重构业务逻辑。
- 不引入新的验证库或序列化方案。
- 不恢复或兼容 GraphQL input 命名。

## Decisions

### 1. 文件名统一为 `*.dto.ts`

所有当前用于 REST 请求入参的 `*.input.ts` 文件重命名为 `*.dto.ts`。

**原因：** 现在技术语义已经是 REST，请求模型应直接表达为 DTO，而不是继续使用 GraphQL input 命名。

### 2. 类名统一为 `*Dto`

例如：
- `RegisterUserInput` → `RegisterUserDto`
- `ScoreCandidateInput` → `ScoreCandidateDto`
- `UpdateCandidateStatusInput` → `UpdateCandidateStatusDto`

**原因：** 文件名和类名应表达一致，避免项目内部同时存在 `input` 与 `dto` 两套词汇。

### 3. 仅调整命名与引用，不改请求结构

控制器、service、测试的引用一并更新，但不改字段、不改路由、不改处理逻辑。

**原因：** 本次变更目标是语义统一，不是接口重构。

## Risks / Trade-offs

- [重命名导致 import 漏改] → 通过全局检索 `*.input.ts` 与 `*Input` 引用后再执行 build/test 验证
- [REST/DTO 语义统一后仍有旧命名残留] → 在 user 和 candidate 模块完整清理现有 input 命名
- [未来新增代码回到 input 命名] → 通过 README 和架构约定统一默认风格
