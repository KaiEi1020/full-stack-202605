import { Tab, TabGroup, TabList } from '@headlessui/react';
import { useEffect, useMemo, useState } from 'react';
import { CandidateStatusBadge } from '../components/CandidateStatusBadge';
import { apiGet } from '../lib/api';

type CandidateSkill = string | { name?: string | null; label?: string | null; value?: string | null };

type CandidateItem = {
  id: string;
  name: string | null;
  email: string | null;
  status: string;
  createdAt: string;
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

export function CandidateListPage({ onOpenDetail }: CandidateListPageProps) {
  const [data, setData] = useState<CandidateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'table' | 'card'>('table');

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        setData(await apiGet<CandidateItem[]>('/api/resumes'));
        setError(null);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : '加载失败');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const items = useMemo(() => {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) {
      return data;
    }
    return data.filter((candidate: CandidateItem) => {
      const text = normalizeText(
        [candidate.name, candidate.email, candidate.status, ...(candidate.skills ?? []).map(getSkillText)]
          .filter((value): value is string => Boolean(value))
          .join(' '),
      );
      return matchesFuzzy(text, normalizedQuery);
    });
  }, [data, query]);

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-4xl border border-line bg-white/80 p-6 shadow-soft backdrop-blur xl:p-8 dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">Resume board</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">简历管理面板</h2>
            <p className="mt-2 text-sm text-ink-500 dark:text-slate-300">查看简历状态、技能标签和 AI 评分，支持表格与卡片双视图。</p>
          </div>
          <div className="grid gap-3 lg:min-w-[24rem]">
            <input className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-accent-300 focus:ring-4 focus:ring-accent-100 dark:border-white/10 dark:bg-slate-950/60 dark:text-white" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索姓名、技能、邮箱" />
            <TabGroup selectedIndex={view === 'table' ? 0 : 1} onChange={(index) => setView(index === 0 ? 'table' : 'card')}>
              <TabList className="inline-flex w-fit rounded-full border border-line bg-white/70 p-1 dark:border-white/10 dark:bg-white/5">
                {['表格', '卡片'].map((label) => (
                  <Tab key={label} className="rounded-full px-4 py-2 text-sm font-medium text-ink-600 outline-none transition data-[selected]:bg-ink-950 data-[selected]:text-white dark:text-slate-300">{label}</Tab>
                ))}
              </TabList>
            </TabGroup>
          </div>
        </div>

        {loading ? <div className="mt-6 rounded-3xl bg-slate-100 px-4 py-4 text-sm text-ink-600 dark:bg-slate-900/60 dark:text-slate-300">正在加载简历...</div> : null}
        {error ? <div className="mt-6 rounded-3xl bg-danger-100 px-4 py-4 text-sm text-danger-700">{error}</div> : null}
        {!loading && !error && items.length === 0 ? <div className="mt-6 rounded-3xl border border-dashed border-line-strong px-4 py-5 text-sm text-ink-500 dark:border-white/10 dark:text-slate-300">没有匹配的简历。</div> : null}

        {!loading && !error && items.length > 0 && view === 'table' ? (
          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-line dark:border-white/10">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-line text-left text-sm dark:divide-white/10">
                <thead className="bg-slate-50/80 text-ink-500 dark:bg-slate-900/50 dark:text-slate-300">
                  <tr>{['姓名', '状态', '技能', '评分', '上传时间'].map((heading) => <th key={heading} className="px-4 py-3 font-medium">{heading}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-line bg-white/60 dark:divide-white/10 dark:bg-transparent">
                  {items.map((candidate) => (
                    <tr key={candidate.id} className="cursor-pointer transition hover:bg-accent-100/40 dark:hover:bg-white/5" onClick={() => onOpenDetail(candidate.id)}>
                      <td className="px-4 py-4 font-medium text-ink-950 dark:text-white">{candidate.name ?? '待提取'}</td>
                      <td className="px-4 py-4"><CandidateStatusBadge status={candidate.status} /></td>
                      <td className="px-4 py-4 text-ink-500 dark:text-slate-300">{formatSkills(candidate.skills ?? []) || '-'}</td>
                      <td className="px-4 py-4 font-semibold text-ink-950 dark:text-white">{candidate.scores[0]?.overallScore ?? '-'}</td>
                      <td className="px-4 py-4 text-ink-500 dark:text-slate-300">{new Date(candidate.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {!loading && !error && items.length > 0 && view === 'card' ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((candidate) => (
              <button key={candidate.id} type="button" className="grid gap-4 rounded-[1.75rem] border border-line bg-white/85 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-accent-300 dark:border-white/10 dark:bg-slate-950/40" onClick={() => onOpenDetail(candidate.id)}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-ink-950 dark:text-white">{candidate.name ?? '待提取'}</h3>
                    <p className="mt-1 text-sm text-ink-500 dark:text-slate-300">{candidate.email ?? '暂无邮箱'}</p>
                  </div>
                  <CandidateStatusBadge status={candidate.status} />
                </div>
                <p className="text-sm text-ink-500 dark:text-slate-300">{formatSkills(candidate.skills ?? []) || '暂无技能标签'}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-500 dark:text-slate-300">综合评分</span>
                  <strong className="text-xl font-semibold text-ink-950 dark:text-white">{candidate.scores[0]?.overallScore ?? '-'} 分</strong>
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
