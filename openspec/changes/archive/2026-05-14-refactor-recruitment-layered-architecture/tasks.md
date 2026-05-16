## 1. 建立 recruitment 四层骨架

- [x] 1.1 盘点现有 `candidate`、`resume-upload`、`screening` 与 `recruitment/applications` 的职责、依赖和对外入口
- [x] 1.2 在 `backend/src/modules/recruitment/` 下创建 `api`、`application`、`domain`、`infrastructure` 四层目录与领域根模块
- [x] 1.3 将现有 `recruitment/applications` 业务目录重命名为 `job-applications`，并确定对应的模块、服务、类型命名方案

## 2. 迁移接口层与应用层

- [x] 2.1 将 `candidate`、`resume-upload`、`screening` 的控制器归位到 `recruitment/api/controller`
- [x] 2.2 将原有流程编排逻辑迁移到 `recruitment/application/service`，明确用例服务边界
- [x] 2.3 整理 DTO、事件推送入口与接口增强代码到 `recruitment/api` 下的合适位置

## 3. 迁移领域层与基础设施层

- [x] 3.1 识别候选人、简历、投递、筛选相关的实体、值对象与领域服务，并迁移到 `recruitment/domain`
- [x] 3.2 为招聘领域定义仓储接口，并将 TypeORM 持久化实现迁移到 `recruitment/infrastructure/persistence`
- [x] 3.3 将大模型、存储、PDF、SSE 等招聘相关外部依赖适配代码归位到 `recruitment/infrastructure/external` 或合适的基础设施位置

## 4. 调整模块装配与依赖引用

- [x] 4.1 用 `recruitment.module.ts` 统一装配招聘领域 controllers、providers、imports 与 exports
- [x] 4.2 更新 `AppModule`、子模块、provider token、实体注册与内部 import 路径到新结构
- [x] 4.3 删除完成迁移后的旧模块装配与废弃目录，确保不再保留歧义性的 `applications` 命名

## 5. 验证行为连续性

- [x] 5.1 更新单元测试与 e2e 测试中的引用路径与模块装配方式
- [x] 5.2 验证简历 REST、候选人操作、AI 评分与 SSE 关键路径在重构后行为保持一致
- [x] 5.3 运行后端相关测试与必要的联调检查，确认重构未破坏现有核心能力
