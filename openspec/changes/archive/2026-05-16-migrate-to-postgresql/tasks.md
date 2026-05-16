## 1. 依赖安装与移除

- [x] 1.1 安装 MikroORM + PostgreSQL 依赖：`@mikro-orm/core`、`@mikro-orm/postgresql`、`@mikro-orm/nestjs`、`@mikro-orm/decorators`、`pg`、`reflect-metadata`
- [x] 1.2 移除 TypeORM + SQLite 依赖：`@nestjs/typeorm`、`typeorm`、`sql.js`
- [x] 1.3 更新 `pnpm-lock.yaml`，确认依赖树干净

## 2. Docker Compose 配置

- [x] 2.1 更新 `docker-compose.yml`：移除 `mysql` 服务，增加 `db`（PostgreSQL 15+）服务，配置环境变量、数据卷、健康检查与资源限制
- [x] 2.2 新增 `docker-compose.local.yml`：仅包含 `db` 服务，映射宿主机 5432 端口，数据卷挂载至 `./postgres/local-data`
- [x] 2.3 在 `docker-compose.yml` 中为 `backend` 服务添加 `depends_on` 与 `DATABASE_URL` 环境变量
- [x] 2.4 验证 `docker-compose -f docker-compose.local.yml up -d` 能成功启动本地 PostgreSQL 容器

## 3. 环境变量更新

- [x] 3.1 更新项目根目录 `.env`：引入 `DATABASE_URL`、`DATABASE_USER`、`DATABASE_PASSWORD`、`DATABASE_NAME`、`DATABASE_HOST`、`DATABASE_PORT`，移除 `SQLITE_DATABASE_PATH`
- [x] 3.2 更新 `backend/.env`：同步数据库相关环境变量
- [x] 3.3 更新 `.env.example`：提供 PostgreSQL 连接串与各独立变量的示例

## 4. 全局 ORM 配置（TypeORM → MikroORM + PostgreSQL）

- [x] 4.1 创建 `core/database/mikro-orm.config.ts`：配置 MikroORM 使用 PostgreSQL 驱动，解析 `DATABASE_URL`
- [x] 4.2 更新 `database.module.ts`：移除 TypeORM 相关导出，适配 MikroORM
- [x] 4.3 更新 `app.module.ts`：将 `TypeOrmModule.forRoot()` 替换为 `MikroOrmModule.forRoot()`
- [x] 4.4 删除 `core/database/typeorm.config.ts`
- [ ] 4.5 验证应用能正常启动并连接到本地 PostgreSQL 实例

## 5. User 模块迁移

- [x] 5.1 重构 `user/infrastructure/persistence/entities/user.entity.ts`：TypeORM 装饰器替换为 MikroORM 装饰器
- [x] 5.2 创建 `user/infrastructure/repositories/mikroorm-user.repository.ts`：基于 MikroORM 实现 `UserRepository` 接口
- [x] 5.3 删除 `user/infrastructure/typeorm-user.repository.ts`
- [x] 5.4 更新 `user.module.ts`：移除 `TypeOrmModule.forFeature`，改为 `MikroOrmModule.forFeature([UserEntity])`，更新仓储提供者绑定
- [x] 5.5 编译并验证 User 相关测试通过

## 6. Recruitment 实体迁移

- [x] 6.1 创建 `recruitment/infrastructure/persistence/entities/resume.entity.ts`：使用 MikroORM 装饰器
- [x] 6.2 创建 `recruitment/infrastructure/persistence/entities/job.entity.ts`：使用 MikroORM 装饰器
- [x] 6.3 创建 `recruitment/infrastructure/persistence/entities/job-application.entity.ts`：使用 MikroORM 装饰器
- [x] 6.4 删除 `recruitment/domain/entity/` 目录及所有文件
- [x] 6.5 更新所有对旧实体路径的导入（`recruitment.module.ts`、测试文件等）

## 7. Recruitment 仓储接口与实现

- [x] 7.1 在 `recruitment/domain/` 下定义 `resume.repository.ts` 接口
- [x] 7.2 在 `recruitment/domain/` 下定义 `job.repository.ts` 接口
- [x] 7.3 在 `recruitment/domain/` 下定义 `job-application.repository.ts` 接口
- [x] 7.4 创建 `recruitment/infrastructure/repositories/mikroorm-resume.repository.ts`
- [x] 7.5 创建 `recruitment/infrastructure/repositories/mikroorm-job.repository.ts`
- [x] 7.6 创建 `recruitment/infrastructure/repositories/mikroorm-job-application.repository.ts`
- [x] 7.7 更新 `recruitment.module.ts`：使用 `MikroOrmModule.forFeature` 注册实体，绑定仓储接口与实现

## 8. Recruitment 应用层解耦

- [x] 8.1 重构 `recruitment/application/service/recruitment.service.ts`：移除 `@InjectRepository`，改为注入仓储接口
- [x] 8.2 重构 `recruitment/application/service/job-application-upload.service.ts`：适配仓储接口
- [x] 8.3 检查并更新 `recruitment/application/service/recruitment-screening-orchestrator.service.ts` 中的数据库访问逻辑
- [x] 8.4 编译并确认 recruitment 模块无 ORM 相关编译错误

## 9. 测试适配

- [x] 9.1 更新 `test/app.e2e-spec.ts`：移除 TypeORM 导入，改为 MikroORM 的 `EntityManager` 与模块导入
- [x] 9.2 更新 `app.controller.spec.ts` 中的 mock 策略（如涉及数据库）
- [ ] 9.3 配置测试环境的数据库连接（可使用独立的测试数据库或事务回滚策略）
- [ ] 9.4 运行完整测试套件（`pnpm test` 与 `pnpm test:e2e`），修复失败用例

## 10. 验证与收尾

- [ ] 10.1 手动验证关键业务流程：创建职位、上传简历、执行筛选、查看评分排行
- [ ] 10.2 确认 `docker-compose.yml` 与 `docker-compose.local.yml` 均能正常启动
- [x] 10.3 运行 `pnpm lint` 修复代码风格问题
- [x] 10.4 清理残留的 TypeORM 类型声明、无用导入及注释
- [ ] 10.5 运行 `/opsx:verify` 验证实现与 spec 一致
