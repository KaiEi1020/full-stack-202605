import { navigate } from '../App';
import type { ScreeningEvent } from '../types/screening';

type ScreeningProgressProps = {
  events: ScreeningEvent[];
  error: string | null;
  candidateId?: string | null;
};

const stageLabel: Record<string, string> = {
  parsing: '解析简历',
  extracting: '提取信息',
  scoring: '岗位评分',
  completed: '处理完成',
  failed: '处理失败',
};

const typeLabel: Record<string, string> = {
  started: '进行中',
  section: '阶段更新',
  completed: '已完成',
  failed: '失败',
};

function getStageLabel(stage: string) {
  return stageLabel[stage] ?? stage;
}

function getTypeLabel(type: string) {
  return typeLabel[type] ?? type;
}

function formatPayload(payload: Record<string, unknown>) {
  const entries = Object.entries(payload).filter(([, value]) => value !== null && value !== undefined && value !== '');
  if (entries.length === 0) {
    return '等待阶段详情...';
  }

  return entries
    .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}`)
    .join('\n');
}

export function ScreeningProgress({ events, error, candidateId }: ScreeningProgressProps) {
  const hasCompleted = events.some((event) => event.type === 'completed' && event.stage === 'completed');
  const hasFailed = events.some((event) => event.type === 'failed');
  const isTracking = Boolean(candidateId) && !hasCompleted && !hasFailed;
  const latestEvent = events.at(-1);
  const latestStageLabel = latestEvent ? getStageLabel(latestEvent.stage) : '准备连接进度流';
  const statusTitle = hasFailed ? '处理失败' : hasCompleted ? '处理完成' : isTracking ? '后台正在处理简历' : '等待开始处理';
  const statusDescription = hasFailed
    ? '处理过程中发生错误，请检查错误提示或重新上传。'
    : hasCompleted
      ? '简历解析、信息提取和岗位评分已经完成。'
      : isTracking
        ? '简历已上传成功，系统正在解析 PDF、提取关键信息并生成岗位匹配结果，进度会持续刷新。'
        : '上传完成后，这里会持续展示解析、提取和评分进度。';
  const statusTone = hasFailed
    ? 'border-danger-100 bg-gradient-to-br from-danger-100 via-white to-rose-50 dark:border-danger-700/30 dark:from-rose-500/10 dark:via-slate-950/40 dark:to-rose-500/10'
    : hasCompleted
      ? 'border-success-100 bg-gradient-to-br from-success-100 via-white to-emerald-50 dark:border-emerald-500/30 dark:from-emerald-500/10 dark:via-slate-950/40 dark:to-emerald-500/10'
      : 'border-accent-200 bg-gradient-to-br from-accent-100 via-white to-sky-50 dark:border-accent-400/30 dark:from-accent-500/10 dark:via-slate-950/40 dark:to-sky-500/10';
  const statusBadgeTone = hasFailed ? 'text-danger-700 dark:text-rose-300' : hasCompleted ? 'text-success-700 dark:text-emerald-300' : 'text-accent-500 dark:text-accent-300';
  const statusDotTone = hasFailed ? 'bg-danger-700' : hasCompleted ? 'bg-success-700' : 'bg-current';
  const statusIconTone = hasFailed ? 'text-danger-700 dark:text-rose-300' : hasCompleted ? 'text-success-700 dark:text-emerald-300' : 'text-accent-500';
  const showPulse = isTracking && !latestEvent;
  const showRunningSpinner = isTracking;
  const showActionButtons = Boolean(candidateId);
  const emptyMessage = candidateId ? '正在连接进度流，稍后会显示处理阶段。' : '等待上传后开始推送处理进度。';

  return (
    <section className="rounded-[2rem] border border-line bg-white/85 p-6 shadow-soft backdrop-blur xl:p-8 dark:border-white/10 dark:bg-white/5">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">Live progress</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">处理进度</h2>
          <p className="mt-2 text-sm text-ink-500 dark:text-slate-300">实时查看解析、提取和评分状态，减少等待中的不确定感。</p>
        </div>
        <span className="rounded-full border border-line bg-white/70 px-3 py-1 font-mono text-xs text-ink-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">SSE</span>
      </div>

      <div className={`mb-5 overflow-hidden rounded-[1.75rem] border p-5 shadow-sm ${statusTone}`}>
        <div className="flex items-start gap-4">
          <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-950/80 ${statusIconTone}`}>
            {showRunningSpinner ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <span className={`h-3 w-3 rounded-full ${hasFailed ? 'bg-danger-700' : hasCompleted ? 'bg-success-700' : 'bg-accent-500'} ${showPulse ? 'animate-pulse' : ''}`} />}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-ink-950 dark:text-white">{statusTitle}</h3>
              <span className={`inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] dark:bg-white/10 ${statusBadgeTone}`}>
                <span className={`inline-flex h-2 w-2 rounded-full ${statusDotTone} ${isTracking ? 'animate-pulse' : ''}`} />
                {latestStageLabel}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-slate-300">{statusDescription}</p>
            {showActionButtons ? (
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex items-center rounded-full bg-ink-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-500"
                  onClick={() => navigate('/candidates')}
                >
                  前往候选人管理面板
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-semibold text-ink-800 transition hover:border-accent-300 hover:text-accent-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                  onClick={() => navigate('/candidate', `?id=${candidateId}`)}
                >
                  查看当前候选人详情
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {error ? <div className="mb-4 rounded-3xl bg-danger-100 px-4 py-3 text-sm text-danger-700">{error}</div> : null}

      <ol className="grid gap-3">
        {events.map((event, index) => {
          const isLatest = index === events.length - 1;
          return (
            <li
              key={event.id}
              className={`rounded-[1.5rem] border px-4 py-4 transition ${isLatest ? 'border-accent-200 bg-accent-100/40 shadow-sm dark:border-accent-400/30 dark:bg-accent-500/10' : 'border-line-strong bg-slate-50/80 dark:border-white/10 dark:bg-slate-900/60'}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex h-2.5 w-2.5 rounded-full ${event.type === 'failed' ? 'bg-danger-700' : event.type === 'completed' ? 'bg-success-700' : 'bg-accent-500'} ${isLatest && event.type !== 'completed' && event.type !== 'failed' ? 'animate-pulse' : ''}`} />
                  <strong className="text-sm font-semibold text-ink-950 dark:text-white">{getStageLabel(event.stage)}</strong>
                </div>
                <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-ink-500 dark:bg-white/10 dark:text-slate-300">{getTypeLabel(event.type)}</span>
              </div>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl bg-white/70 px-3 py-3 font-mono text-xs leading-6 text-ink-500 dark:bg-slate-950/50 dark:text-slate-300">{formatPayload(event.payload)}</pre>
            </li>
          );
        })}
        {events.length === 0 ? (
          <li className="rounded-[1.5rem] border border-dashed border-line-strong bg-white/60 px-4 py-6 text-sm text-ink-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            {emptyMessage}
          </li>
        ) : null}
      </ol>
    </section>
  );
}
