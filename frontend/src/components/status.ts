const statusMeta = {
  PENDING: { label: '解析中', description: '简历已进入解析或待处理阶段。', tone: 'bg-warning-100 text-warning-700 dark:bg-amber-500/15 dark:text-amber-300', pending: true },
  PASSED: { label: '初筛通过', description: '简历已通过初筛，可进入下一阶段。', tone: 'bg-success-100 text-success-700 dark:bg-emerald-500/15 dark:text-emerald-300', pending: false },
  INTERVIEWING: { label: '面试中', description: '候选人已进入面试流程。', tone: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300', pending: false },
  HIRED: { label: '已录用', description: '候选人已确认录用。', tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300', pending: false },
  REJECTED: { label: '已淘汰', description: '简历已结束流程，不再推进。', tone: 'bg-danger-100 text-danger-700 dark:bg-rose-500/15 dark:text-rose-300', pending: false },
} as const;

export function getCandidateStatusMeta(status: string) {
  return statusMeta[status.toUpperCase() as keyof typeof statusMeta] ?? { label: status, description: '当前状态暂无附加说明。', tone: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200', pending: false };
}

export { statusMeta };
