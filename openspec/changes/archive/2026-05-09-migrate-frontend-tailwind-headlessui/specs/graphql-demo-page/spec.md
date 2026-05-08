## MODIFIED Requirements

### Requirement: 前端必须提供 GraphQL 示例页面
系统 MUST 在前端提供一个可见的独立页面，用于演示 GraphQL 数据请求与结果展示，并遵循新的 Tailwind 与 Headless UI 设计体系。

#### Scenario: 打开示例页面
- **WHEN** 用户打开前端应用并访问 GraphQL demo 路由
- **THEN** 页面必须展示采用新设计体系构建的 GraphQL 示例界面及触发数据请求的入口

### Requirement: 前端必须通过 Apollo Client 展示用户查询结果
系统 MUST 使用 Apollo Client 从后端 GraphQL 接口获取用户数据并渲染到界面，同时保持与新页面布局一致的结果展示方式。

#### Scenario: 查询成功
- **WHEN** 用户触发用户数据查询且后端成功返回结果
- **THEN** 页面必须在新的 UI 布局中展示返回的用户列表或用户字段内容

### Requirement: 前端必须反馈请求状态
系统 MUST 在示例界面中反馈加载中和请求失败状态，并使用统一的状态样式呈现。

#### Scenario: 请求进行中
- **WHEN** GraphQL 请求尚未完成
- **THEN** 页面必须显示新的加载状态样式

#### Scenario: 请求失败
- **WHEN** GraphQL 请求失败或返回错误
- **THEN** 页面必须向用户展示新的错误状态样式信息
