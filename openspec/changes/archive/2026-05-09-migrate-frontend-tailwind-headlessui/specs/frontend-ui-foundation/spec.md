## ADDED Requirements

### Requirement: 前端必须使用 Tailwind CSS 作为主要样式体系
系统 MUST 在前端构建链中接入 Tailwind CSS，并将页面样式实现迁移到 Tailwind class 驱动的方式。

#### Scenario: 构建前端页面
- **WHEN** 开发者运行前端开发或构建命令
- **THEN** 系统必须正确编译 Tailwind 样式并应用到页面

### Requirement: 前端必须提供 Headless UI 交互基础
系统 MUST 在前端引入 Headless UI，作为交互组件行为层的基础实现。

#### Scenario: 渲染交互组件
- **WHEN** 页面需要下拉、弹层、切换或对话框等交互结构
- **THEN** 系统必须能够通过 Headless UI 组件模式承载这些交互行为
