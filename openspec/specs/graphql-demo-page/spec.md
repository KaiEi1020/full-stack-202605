## Purpose

TBD

## Requirements

### Requirement: 前端必须提供 GraphQL 示例页面
系统 MUST 在前端提供一个可见的独立页面，用于演示 GraphQL 数据请求与结果展示。

#### Scenario: 打开示例页面
- **WHEN** 用户打开前端应用并访问 GraphQL demo 路由
- **THEN** 页面必须展示 GraphQL 示例界面及触发数据请求的入口

### Requirement: 前端必须通过 Apollo Client 展示用户查询结果
系统 MUST 使用 Apollo Client 从后端 GraphQL 接口获取用户数据并渲染到界面。

#### Scenario: 查询成功
- **WHEN** 用户触发用户数据查询且后端成功返回结果
- **THEN** 页面必须展示返回的用户列表或用户字段内容

### Requirement: 前端必须反馈请求状态
系统 MUST 在示例界面中反馈加载中和请求失败状态。

#### Scenario: 请求进行中
- **WHEN** GraphQL 请求尚未完成
- **THEN** 页面必须显示正在加载的状态

#### Scenario: 请求失败
- **WHEN** GraphQL 请求失败或返回错误
- **THEN** 页面必须向用户展示错误状态信息
