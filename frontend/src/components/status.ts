const statusMeta = {
  PENDING: { label: '解析中', tone: 'bg-warning-100 text-warning-700 dark:bg-amber-500/15 dark:text-amber-300', pending: true },
  PASSED: { label: '初筛通过', tone: 'bg-success-100 text-success-700 dark:bg-emerald-500/15 dark:text-emerald-300', pending: false },
  INTERVIEWING: { label: '面试中', tone: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300', pending: false },
  HIRED: { label: '已录用', tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300', pending: false },
  REJECTED: { label: '已淘汰', tone: 'bg-danger-100 text-danger-700 dark:bg-rose-500/15 dark:text-rose-300', pending: false },
} as const;

export function getCandidateStatusMeta(status: string) {
  return statusMeta[status.toUpperCase() as keyof typeof statusMeta] ?? { label: status, tone: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200', pending: false };
}
