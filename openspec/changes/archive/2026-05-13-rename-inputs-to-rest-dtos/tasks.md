## 1. 重命名 REST 请求模型

- [x] 1.1 将 `modules/user/` 中现有 REST 请求模型从 `*.input.ts` / `*Input` 重命名为 DTO 风格
- [x] 1.2 将 `modules/candidate/dto/` 中现有 REST 请求模型从 `*.input.ts` / `*Input` 重命名为 DTO 风格
- [x] 1.3 更新相关文件导出与类名，保持命名一致

## 2. 修复引用与约定

- [x] 2.1 更新 controller、service、测试和模块内部对重命名 DTO 的引用
- [x] 2.2 清理残留的 `*.input.ts` 和 `*Input` 风格命名
- [x] 2.3 确保 README 或架构约定体现 REST 项目默认使用 DTO 命名

## 3. 验证与回归

- [x] 3.1 运行 `cd backend && pnpm build`，确认 DTO 重命名后编译通过
- [x] 3.2 运行 `cd backend && pnpm test`，确认 DTO 重命名后测试通过
- [x] 3.3 启动后端应用并验证重命名未影响模块装配与接口行为
