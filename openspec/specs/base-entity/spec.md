## Purpose

定义统一的实体基础字段管理能力，包括主键、时间戳和软删除字段。

## Requirements

### Requirement: 系统必须提供统一的实体基础字段
系统 MUST 通过 `BaseEntity` 抽象类为所有实体提供统一的基础字段，包括主键、时间戳和软删除字段。

#### Scenario: 实体继承 BaseEntity
- **WHEN** 创建新的实体类
- **THEN** 系统 MUST 允许实体继承 `BaseEntity` 以获得基础字段

#### Scenario: 基础字段自动填充
- **WHEN** 创建新的实体实例并持久化
- **THEN** 系统 MUST 自动填充 `createdAt` 和 `updatedAt` 字段
- **AND** `id` 字段 MUST 自动生成

### Requirement: 系统必须支持主键自动生成
系统 MUST 为继承 `BaseEntity` 的实体提供主键自动生成能力。

#### Scenario: 主键自动生成
- **WHEN** 持久化新的实体实例
- **THEN** 系统 MUST 自动生成唯一的主键值

### Requirement: 系统必须支持时间戳自动管理
系统 MUST 为继承 `BaseEntity` 的实体提供时间戳自动管理能力。

#### Scenario: 创建时间自动设置
- **WHEN** 创建新的实体实例并持久化
- **THEN** 系统 MUST 自动设置 `createdAt` 为当前时间

#### Scenario: 更新时间自动更新
- **WHEN** 更新已存在的实体实例并持久化
- **THEN** 系统 MUST 自动更新 `updatedAt` 为当前时间

### Requirement: 系统必须支持软删除
系统 MUST 为继承 `BaseEntity` 的实体提供软删除能力。

#### Scenario: 软删除标记
- **WHEN** 删除实体实例
- **THEN** 系统 MUST 设置 `deletedAt` 为当前时间，而非物理删除记录

#### Scenario: 软删除记录查询
- **WHEN** 查询实体记录
- **THEN** 系统 MUST 返回所有记录（包括已软删除的记录）
- **AND** 业务代码 MUST 通过 `deletedAt` 字段判断是否已删除

### Requirement: BaseEntity 必须定义为抽象类
系统 MUST 将 `BaseEntity` 定义为抽象类，防止直接实例化。

#### Scenario: BaseEntity 不能直接实例化
- **WHEN** 尝试直接实例化 `BaseEntity`
- **THEN** 系统 MUST 阻止实例化（TypeScript 编译错误）
