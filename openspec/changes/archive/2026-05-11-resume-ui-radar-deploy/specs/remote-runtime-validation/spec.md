## ADDED Requirements

### Requirement: 系统必须支持镜像打包验证
系统 MUST 能够完成当前项目的镜像构建，以验证前后端运行时打包链路可用。

#### Scenario: 执行镜像构建
- **WHEN** 开发者在项目中执行约定的镜像打包流程
- **THEN** 系统必须能够成功构建所需镜像或给出明确失败原因

### Requirement: 系统必须验证远程启动脚本
系统 MUST 验证 `bash ./scripts/start-remote.sh` 的执行链路，确保远程启动脚本与当前打包结果匹配。

#### Scenario: 执行远程启动脚本
- **WHEN** 开发者执行 `bash ./scripts/start-remote.sh`
- **THEN** 系统必须能够完成脚本校验、启动过程验证或输出明确的失败信息
