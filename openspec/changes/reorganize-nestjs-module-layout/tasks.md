## 1. 顶层目录归类

- [x] 1.1 在 `backend/src/` 下创建 `modules/`、`core/`，并按需预留 `shared/` 目录
- [x] 1.2 将 `user`、`candidate`、`resume-upload`、`screening` 迁移到 `backend/src/modules/`
- [x] 1.3 将 `database`、`storage`、`pdf`、`sse`、`bigmodel` 迁移到 `backend/src/core/`

## 2. 模块装配与引用修复

- [x] 2.1 更新 `backend/src/app.module.ts` 中各模块的导入路径
- [x] 2.2 修复目录迁移后各业务模块内部的相对 import 路径
- [x] 2.3 修复目录迁移后各基础设施模块内部的相对 import 路径

## 3. 混合架构约定落地

- [x] 3.1 保持复杂模块支持 `application/domain/infrastructure` 分层，不强制改写为 CRUD 结构
- [x] 3.2 保持简单模块支持 controller/service/repository 的直接 CRUD 结构，不强制套用 DDD 样板
- [x] 3.3 为后续新增复杂模块（如商品、订单）明确沿用 `src/modules/<feature>/application|domain|infrastructure` 组织方式

## 4. 验证与回归

- [x] 4.1 运行 `cd backend && pnpm build`，确认目录迁移后编译通过
- [x] 4.2 运行 `cd backend && pnpm test`，确认受影响单元测试通过
- [x] 4.3 启动后端应用并验证关键模块装配、依赖注入和主要接口行为保持正常
