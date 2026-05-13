## Why

当前项目后端已经改成 REST 风格，不再以 GraphQL code-first 作为主要组织语义，但模块里仍保留 `*.input.ts` 和 `*Input` 这类更偏 GraphQL 输入模型的命名。继续沿用这套命名会让 REST 请求模型语义不清，也会让新代码在 DTO 命名上持续混用两套风格。

现在统一改成 REST 请求 DTO 命名，可以让控制器入参、目录命名和技术栈语义保持一致，降低后续维护和沟通成本。

## What Changes

- 将当前后端中用于 REST 请求的 `*.input.ts` 文件改名为 `*.dto.ts`。
- 将对应类名从 `*Input` 统一调整为更符合 REST 语义的 `*Dto`。
- 更新 controller、service、测试和模块内部对这些类型的引用。
- 保持请求字段结构、接口行为和运行逻辑不变，仅调整命名与引用关系。

## Capabilities

### New Capabilities
- `rest-dto-naming`: 定义 REST 风格后端中请求模型统一使用 DTO 命名的约定

### Modified Capabilities
- `backend-architecture`: 调整后端架构要求，使其明确在 REST 风格项目中使用 DTO 命名而不是 GraphQL input 命名

## Impact

- 受影响代码主要位于 `backend/src/modules/user/` 和 `backend/src/modules/candidate/`。
- 不改变对外 API，也不引入新的依赖。
- 主要影响类型文件命名、类名和模块内部导入路径。
- 需要通过构建、测试和启动验证确认重命名后引用关系正常。
