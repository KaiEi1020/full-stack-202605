## ADDED Requirements

### Requirement: REST 请求模型必须使用 DTO 命名
系统 MUST 在 REST 风格后端中将请求模型统一命名为 DTO，而不是继续使用 GraphQL input 风格命名。

#### Scenario: 定义新的 REST 请求模型
- **WHEN** 开发者为 REST 控制器新增请求模型
- **THEN** 系统必须允许并要求使用 `*.dto.ts` 文件名和 `*Dto` 类名

#### Scenario: 维护现有 REST 请求模型
- **WHEN** 开发者维护已经用于 REST 请求的输入模型
- **THEN** 系统必须将 `*.input.ts` 和 `*Input` 命名迁移为 DTO 风格命名

### Requirement: DTO 命名迁移后接口行为必须保持不变
系统 MUST 在将 REST 请求模型迁移为 DTO 命名后保持字段结构、控制器签名语义和接口运行行为不变。

#### Scenario: 重命名请求模型后处理请求
- **WHEN** 开发者将某个 REST 请求模型从 `*Input` 重命名为 `*Dto`
- **THEN** 系统必须继续按原有字段结构接收请求并完成相同业务处理
