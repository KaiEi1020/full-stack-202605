## Why

当前前端主要依赖手写 `App.css` 维护样式，随着页面数量和交互复杂度上升，样式复用、状态样式一致性和组件可维护性都会迅速变差。现在将前端迁移到 Tailwind CSS 与 Headless UI，可以统一设计表达方式，并为后续复杂交互组件提供可复用基础。

## What Changes

- 在前端引入 Tailwind CSS，替换当前主要依赖手写全局样式文件的开发方式。
- 在前端引入 Headless UI，用于承载交互型组件的无样式行为层。
- 将现有核心页面和导航结构迁移到 Tailwind class 驱动的实现。
- 为现有前端页面建立新的 UI 约束，确保 GraphQL demo、注册页及后续工作台页面都能在统一样式体系下演进。
- **BREAKING**：现有 `App.css`/`index.css` 为主的样式组织方式将不再作为主要事实来源。

## Capabilities

### New Capabilities
- `frontend-ui-foundation`: 前端基于 Tailwind CSS 与 Headless UI 的统一样式和交互基础设施
- `frontend-design`: 基于新样式体系重新优化页面视觉层次、布局和交互质感

### Modified Capabilities
- `graphql-demo-page`: GraphQL 示例页面的视觉结构、状态反馈和交互容器迁移到新的 UI 基础体系

## Impact

- 受影响代码主要在 `frontend/`，包括依赖、Vite/Tailwind 配置、全局样式入口和现有页面组件。
- 前端构建链会新增 Tailwind CSS 与 Headless UI 相关依赖和配置。
- 现有页面的 className、布局结构和样式组织方式会发生调整。
