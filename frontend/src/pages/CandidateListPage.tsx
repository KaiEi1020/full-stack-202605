import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Tab, TabGroup, TabList } from '@headlessui/react';
import { ArrowPathIcon, CloudArrowUpIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CandidateStatusBadge } from '../components/CandidateStatusBadge';
import { Toast } from '../components/Toast';
import { UploadForm } from '../components/UploadForm';
import { useResumeUpload } from '../hooks/useResumeUpload';
import { apiGet } from '../lib/api';

type CandidateSkill = string | { name?: string | null; label?: string | null; value?: string | null };

type CandidateItem = {
  id: string;
  resumeId: string;
  jobId: string;
  name: string | null;
  email: string | null;
  status: string;
  parseStatus: string;
  parseErrorMessage: string | null;
  screeningStatus: string;
  screeningStage: string | null;
  createdAt: string;
  updatedAt: string;
  skills: CandidateSkill[];
  scores: Array<{ overallScore: number }>;
};

type CandidateListPageProps = {
  onOpenDetail: (candidateId: string) => void;
};

function getSkillText(skill: CandidateSkill) {
  if (typeof skill === 'string') {
    return skill;
  }
  return skill.name ?? skill.label ?? skill.value ?? '';
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function matchesFuzzy(text: string, query: string) {
  if (text.includes(query)) {
    return true;
  }
  return text.replace(/\s+/g, '').includes(query.replace(/\s+/g, ''));
}

function formatSkills(skills: CandidateSkill[]) {
  return skills.map(getSkillText).filter(Boolean).join('、');
}

function getPipelineStatus(candidate: CandidateItem) {
  if (candidate.parseStatus === 'FAILED') {
    return {
      label: '解析失败',
      tone: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
      pending: false,
    };
  }
  if (candidate.parseStatus === 'PENDING' || candidate.screeningStatus === 'RUNNING') {
    return {
      label: candidate.screeningStage === 'scoring' ? '评分中' : '解析中',
      tone: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
      pending: true,
    };
  }
  return {
    label: '已完成',
    tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    pending: false,
  };
}

export function CandidateListPage({ onOpenDetail }: CandidateListPageProps) {
  const [data, setData] = useState<CandidateItem[]>([]);
  const defaultJobId = 'default-job';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'table' | 'card'>('table');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { upload, isUploading, error: uploadError } = useResumeUpload();

  const loadCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setData(await apiGet<CandidateItem[]>('/api/recruitment/submissions'));
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCandidates();
  }, [loadCandidates]);

  const hasRunningItems = useMemo(
    () => data.some((candidate) => candidate.parseStatus === 'PENDING' || candidate.screeningStatus === 'RUNNING'),
    [data],
  );

  useEffect(() => {
    if (!hasRunningItems) {
      return;
    }
    const timer = window.setInterval(() => {
      void loadCandidates();
    }, 4000);
    return () => window.clearInterval(timer);
  }, [hasRunningItems, loadCandidates]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const items = useMemo(() => {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) {
      return data;
    }
    return data.filter((candidate: CandidateItem) => {
      const text = normalizeText(
        [candidate.name, candidate.email, candidate.status, candidate.parseErrorMessage, ...(candidate.skills ?? []).map(getSkillText)]
          .filter((value): value is string => Boolean(value))
          .join(' '),
      );
      return matchesFuzzy(text, normalizedQuery);
    });
  }, [data, query]);

  return (
    <>
      {toastMessage ? <Toast message={toastMessage} /> : null}
      <Dialog open={isUploadOpen} onClose={() => !isUploading && setIsUploadOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm" />
        <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6">
          <div className="flex min-h-full items-center justify-center">
            <DialogPanel className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white p-6 shadow-2xl dark:bg-slate-950 sm:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">Resume upload</p>
                  <DialogTitle className="mt-2 text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">上传简历到管理列表</DialogTitle>
                  <p className="mt-2 text-sm text-ink-500 dark:text-slate-300">上传完成后可直接关闭弹窗，解析状态会继续在列表中更新。</p>
                </div>
                <button type="button" className="rounded-full border border-line bg-white/80 px-4 py-2 text-sm text-ink-600 transition hover:border-accent-300 hover:text-accent-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-300" onClick={() => setIsUploadOpen(false)} disabled={isUploading}>
                  关闭
                </button>
              </div>
              <UploadForm
                isUploading={isUploading}
                onSubmit={async (files, jdText, requiredSkills, preferredSkills) => {
                  const result = await upload(
                    defaultJobId,
                    files,
                    jdText,
                    requiredSkills,
                    preferredSkills,
                  );
                  await loadCandidates();
                  setToastMessage(`已提交 ${result.length} 份简历，后台正在继续处理`);
                }}
              />
              {uploadError ? <div className="mt-4 rounded-3xl bg-danger-100 px-4 py-3 text-sm text-danger-700">{uploadError}</div> : null}
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="rounded-4xl border border-line bg-white/80 p-6 shadow-soft backdrop-blur xl:p-8 dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">Resume board</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">简历管理面板</h2>
              <p className="mt-2 text-sm text-ink-500 dark:text-slate-300">在同一页面完成上传、追踪解析状态，并查看失败原因与评分结果。</p>
            </div>
            <div className="grid gap-3 lg:min-w-[28rem]">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-accent-300 focus:ring-4 focus:ring-accent-100 dark:border-white/10 dark:bg-slate-950/60 dark:text-white" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索姓名、技能、邮箱、失败原因" />
                <button type="button" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-500" onClick={() => setIsUploadOpen(true)}>
                  <CloudArrowUpIcon className="h-5 w-5" />
                  上传简历
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <TabGroup selectedIndex={view === 'table' ? 0 : 1} onChange={(index) => setView(index === 0 ? 'table' : 'card')}>
                  <TabList className="inline-flex w-fit rounded-full border border-line bg-white/70 p-1 dark:border-white/10 dark:bg-white/5">
                    {['表格', '卡片'].map((label) => (
                      <Tab key={label} className="rounded-full px-4 py-2 text-sm font-medium text-ink-600 outline-none transition data-[selected]:bg-ink-950 data-[selected]:text-white dark:text-slate-300">{label}</Tab>
                    ))}
                  </TabList>
                </TabGroup>
                {hasRunningItems ? (
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    后台正在处理简历
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {loading ? <div className="mt-6 rounded-3xl bg-slate-100 px-4 py-4 text-sm text-ink-600 dark:bg-slate-900/60 dark:text-slate-300">正在加载简历...</div> : null}
          {error ? <div className="mt-6 rounded-3xl bg-danger-100 px-4 py-4 text-sm text-danger-700">{error}</div> : null}
          {!loading && !error && items.length === 0 ? <div className="mt-6 rounded-3xl border border-dashed border-line-strong px-4 py-5 text-sm text-ink-500 dark:border-white/10 dark:text-slate-300">没有匹配的简历。</div> : null}

          {!loading && !error && items.length > 0 && view === 'table' ? (
            <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-line dark:border-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-full table-fixed divide-y divide-line text-left text-sm dark:divide-white/10">
                  <thead className="bg-slate-50/80 text-ink-500 dark:bg-slate-900/50 dark:text-slate-300">
                    <tr>
                      <th className="w-[18%] px-4 py-3 font-medium">姓名</th>
                      <th className="w-[16%] px-4 py-3 font-medium">候选状态</th>
                      <th className="w-[16%] px-4 py-3 font-medium">解析状态</th>
                      <th className="w-[24%] px-4 py-3 font-medium">失败原因</th>
                      <th className="w-[16%] px-4 py-3 font-medium">技能</th>
                      <th className="w-[10%] px-4 py-3 font-medium">评分</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-white/60 dark:divide-white/10 dark:bg-transparent">
                    {items.map((candidate) => {
                      const pipelineStatus = getPipelineStatus(candidate);
                      return (
                        <tr key={candidate.id} className="cursor-pointer align-top transition hover:bg-accent-100/40 dark:hover:bg-white/5" onClick={() => onOpenDetail(candidate.id)}>
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-ink-950 dark:text-white">{candidate.name ?? '待提取'}</p>
                              <p className="mt-1 text-xs text-ink-500 dark:text-slate-400">{candidate.email ?? '暂无邮箱'}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4"><CandidateStatusBadge status={candidate.status} /></td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-[0.2em] ${pipelineStatus.tone}`}>
                              {pipelineStatus.pending ? <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" /> : null}
                              {pipelineStatus.label}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-ink-500 dark:text-slate-300">
                            {candidate.parseErrorMessage ? (
                              <div className="inline-flex items-start gap-2 rounded-2xl bg-rose-50 px-3 py-2 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
                                <ExclamationCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
                                <span className="line-clamp-3">{candidate.parseErrorMessage}</span>
                              </div>
                            ) : (
                              <span className="text-ink-400 dark:text-slate-500">—</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-ink-500 dark:text-slate-300">{formatSkills(candidate.skills ?? []) || '—'}</td>
                          <td className="px-4 py-4 font-semibold text-ink-950 dark:text-white">{candidate.scores[0]?.overallScore ?? '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {!loading && !error && items.length > 0 && view === 'card' ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((candidate) => {
                const pipelineStatus = getPipelineStatus(candidate);
                return (
                  <button key={candidate.id} type="button" className="grid gap-4 rounded-[1.75rem] border border-line bg-white/85 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-accent-300 dark:border-white/10 dark:bg-slate-950/40" onClick={() => onOpenDetail(candidate.id)}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-ink-950 dark:text-white">{candidate.name ?? '待提取'}</h3>
                        <p className="mt-1 text-sm text-ink-500 dark:text-slate-300">{candidate.email ?? '暂无邮箱'}</p>
                      </div>
                      <CandidateStatusBadge status={candidate.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${pipelineStatus.tone}`}>
                        {pipelineStatus.pending ? <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" /> : null}
                        {pipelineStatus.label}
                      </span>
                    </div>
                    <p className="text-sm text-ink-500 dark:text-slate-300">{formatSkills(candidate.skills ?? []) || '暂无技能标签'}</p>
                    {candidate.parseErrorMessage ? <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{candidate.parseErrorMessage}</div> : null}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-500 dark:text-slate-300">综合评分</span>
                      <strong className="text-xl font-semibold text-ink-950 dark:text-white">{candidate.scores[0]?.overallScore ?? '-'} 分</strong>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}
