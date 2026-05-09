# full-stack-202605

一个面向大 DAU 与复杂业务场景的全栈模板。

适合需要同时兼顾以下目标的团队：

- 支撑高并发访问与持续演进的业务需求
- 在复杂领域中保持模块边界清晰、可维护、可扩展
- 在简单场景下避免过度设计，保持开发效率
- 以前后端分离的方式快速启动中大型业务系统

## 技术栈

| 层 | 技术 |
| --- | --- |
| 前端 | React 19 + Vite |
| 后端 | NestJS 11 |
| 语言 | TypeScript |
| 包管理 | pnpm |

## 设计目标

这个模板不是只服务于 Demo 或小型后台，而是面向真实业务系统：

- **可承载大 DAU**：适合作为高访问量产品的基础工程骨架
- **可应对复杂业务**：适合包含多角色、多流程、多状态流转的业务域
- **分层清晰**：便于多人协作、模块拆分和后续演进
- **不过度复杂**：不是所有模块都强制上重模式，按业务复杂度选择实现方式

## 后端架构策略

后端基于 **NestJS**。

针对不同复杂度的业务模块，采用两种实现策略：

### 1. 复杂模块：使用 DDD

当模块具备明显的领域复杂性时，优先采用 DDD（领域驱动设计），例如：

- 业务规则多且变化频繁
- 状态流转复杂
- 聚合、实体、值对象边界明确
- 需要长期维护并持续扩展

DDD 的目标不是增加形式感，而是让复杂业务逻辑具备更清晰的领域表达和更稳固的演进能力。

### 2. 简单模块：使用普通 service

当模块逻辑直接、规则简单、生命周期短时，使用常规的 NestJS service / controller 模式即可，例如：

- CRUD 为主的基础管理模块
- 规则较少的配置类模块
- 不值得引入复杂领域建模的场景

这样可以避免把所有问题都 DDD 化，在可维护性与开发效率之间取得平衡。

## 前端架构策略

前端基于 **React**，适合构建中大型单页应用。

推荐原则：

- 简单页面保持直接、轻量的组件实现
- 复杂业务页面按领域或模块拆分
- 让前端模块边界尽量与后端业务边界对齐
- 优先追求可读性、可维护性与可扩展性

## 适用场景

这个模板尤其适合：

- 面向大量用户的互联网产品
- 业务流程复杂的管理系统或平台型系统
- 需要持续迭代、多人协作的中后台项目
- 希望在“工程规范”和“开发效率”之间取得平衡的团队

## 项目结构

```text
.
├── frontend/   # React + Vite 前端应用
├── backend/    # NestJS 后端应用
└── pnpm-workspace.yaml
```

## Workspace 用法

| 操作 | 命令 |
| --- | --- |
| 安装全部依赖 | `pnpm install` |
| 启动前端开发服务 | `pnpm --filter frontend dev` |
| 启动后端开发服务 | `pnpm --filter backend start:dev` |
| 构建全部应用 | `pnpm -r build` |
| 检查全部应用 | `pnpm -r lint` |
| 运行后端测试 | `pnpm --filter backend test` |

## 开发原则

- 复杂模块重建模：用 DDD 解决复杂性
- 简单模块重效率：用普通 service 快速交付
- 前后端职责清晰：降低耦合，便于协作
- 模板先服务真实业务，再服务展示效果


## 部署
docker save -o frontend.tar frontend:latest
docker save -o backend.tar backend:latest

gzip frontend.tar
gzip backend.tar
scp frontend.tar.gz backend.tar.gz root@1.13.20.235:~/resume-app/

服务器: 
gunzip frontend.tar.gz
gunzip backend.tar.gz

docker load -i frontend.tar
docker load -i backend.tar


gunzip -f resume-frontend.tar.gz
gunzip -f resume-backend.tar.gz

docker load -i resume-frontend.tar
docker load -i resume-backend.tar

安装compose 插件
