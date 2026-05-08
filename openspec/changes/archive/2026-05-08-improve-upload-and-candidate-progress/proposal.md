## Why

当前上传筛选页和候选人管理面板对“后台仍在处理中”的反馈不够明确：上传成功后缺少可感知的成功提示，处理中的状态缺少持续可见的 loading 指引，用户也缺少前往候选人管理面板继续查看解析结果的路径提示。这会让用户误以为流程已经结束或系统卡住。

## What Changes

- 为上传筛选页增加处理中 loading 反馈，明确提示后台仍在解析简历。
- 在上传成功后增加 toast 提示："简历上传成功, 交给大模型解析中..."。
- 在上传筛选页增加引导文案或入口，提示用户可前往候选人管理面板查看后续结果。
- 将候选人管理面板中的状态展示改为中文文案。
- 当候选人尚未解析完成时，在候选人管理面板中增加进度中的视觉提示，而不是只显示静态状态文本。

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `resume-upload-parsing`: 补充上传成功后的 toast、处理中 loading 反馈，以及引导用户前往候选人管理面板查看解析结果的要求。
- `candidate-management-dashboard`: 补充候选人状态中文展示与未解析完成时进度提示的要求。

## Impact

- 受影响前端页面：`frontend/src/pages/ResumeUploadPage.tsx`、`frontend/src/pages/CandidateListPage.tsx`
- 受影响前端组件：`frontend/src/components/ScreeningProgress.tsx`、`frontend/src/components/CandidateStatusBadge.tsx`、上传相关组件与提示组件
- 可能复用现有消息通知能力或新增前端 toast 依赖/封装
- 不涉及后端 API 协议变更，但会更明显依赖现有候选人状态与 SSE/轮询进度信息
