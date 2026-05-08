import type { ScreeningEvent } from '../types/screening';

type ScreeningProgressProps = {
  events: ScreeningEvent[];
  error: string | null;
};

export function ScreeningProgress({ events, error }: ScreeningProgressProps) {
  const isRunning = events.length > 0 && !events.some((event) => event.type === 'completed' && event.stage === 'completed') && !events.some((event) => event.type === 'failed');

  return (
    <section className="rounded-4xl border border-line bg-white/80 p-6 shadow-soft backdrop-blur xl:p-8 dark:border-white/10 dark:bg-white/5">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">Live progress</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">处理进度</h2>
        </div>
        <span className="rounded-full border border-line bg-white/70 px-3 py-1 font-mono text-xs text-ink-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">SSE</span>
      </div>

      {isRunning ? (
        <div className="mb-4 rounded-3xl border border-accent-200 bg-accent-100/50 px-4 py-3 text-sm text-accent-500 dark:border-accent-400/30 dark:bg-accent-500/10 dark:text-accent-300">
          <span className="inline-flex items-center gap-2 font-medium">
            <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-current" />
            后台正在处理中，进度会持续更新。
          </span>
        </div>
      ) : null}

      {error ? <div className="mb-4 rounded-3xl bg-danger-100 px-4 py-3 text-sm text-danger-700">{error}</div> : null}

      <ol className="grid gap-3">
        {events.map((event) => (
          <li key={event.id} className="rounded-3xl border border-line-strong bg-slate-50/80 px-4 py-4 dark:border-white/10 dark:bg-slate-900/60">
            <div className="flex items-center justify-between gap-3">
              <strong className="text-sm font-semibold text-ink-950 dark:text-white">{event.stage}</strong>
              <span className="rounded-full bg-accent-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-500">{event.type}</span>
            </div>
            <p className="mt-3 break-all font-mono text-xs leading-6 text-ink-500 dark:text-slate-300">{JSON.stringify(event.payload)}</p>
          </li>
        ))}
        {events.length === 0 ? (
          <li className="rounded-3xl border border-dashed border-line-strong bg-white/60 px-4 py-5 text-sm text-ink-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            等待上传后开始推送处理进度。
          </li>
        ) : null}
      </ol>
    </section>
  );
}
