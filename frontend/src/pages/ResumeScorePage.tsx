import { useEffect, useState } from 'react';
import { ScoreChart } from '../components/ScoreChart';
import { apiGet, apiPost } from '../lib/api';

type ResumeScorePageProps = {
  applicationId: string;
};

type ResumeDetail = {
  id: string;
  name: string | null;
  scores: Array<{
    overallScore: number;
    skillScore: number;
    experienceScore: number;
    educationScore: number;
    aiComment: string;
  }>;
};

export function ResumeScorePage({ applicationId }: ResumeScorePageProps) {
  const [resume, setResume] = useState<ResumeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setResume(await apiGet<ResumeDetail | null>(`/api/recruitment/submissions/${applicationId}`));
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [applicationId]);

  const score = resume?.scores[0];

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-[2rem] border border-accent-100 bg-gradient-to-br from-white via-white to-violet-50 px-6 py-8 shadow-soft dark:border-white/10 dark:from-white/10 dark:via-slate-950/60 dark:to-violet-950/30">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">Resume AI Score</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink-950 dark:text-white">简历评分详情</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-ink-500 dark:text-slate-300">展示技能匹配度、经验相关性、教育背景契合度与 AI 综合评语。</p>
      </section>

      <section className="rounded-4xl border border-line bg-white/80 p-6 shadow-soft backdrop-blur xl:p-8 dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">{resume?.name ?? '未命名简历'}</h2>
            <p className="mt-2 text-sm text-ink-500 dark:text-slate-300">通过 `POST /api/recruitment/submissions/:id/score` 获取最新评分。</p>
          </div>
          <button type="button" className="inline-flex items-center rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-500 disabled:cursor-not-allowed disabled:bg-slate-400" disabled={scoring} onClick={async () => {
            try {
              setScoring(true);
              await apiPost(`/api/recruitment/submissions/${applicationId}/score`, { jdText: '通用岗位需求', requiredSkills: [], preferredSkills: [] });
              await load();
            } catch (scoreError) {
              setError(scoreError instanceof Error ? scoreError.message : '评分失败');
            } finally {
              setScoring(false);
            }
          }}>
            {scoring ? '评分中…' : '重新评分'}
          </button>
        </div>

        {loading ? <div className="mt-6 rounded-3xl bg-slate-100 px-4 py-4 text-sm text-ink-600 dark:bg-slate-900/60 dark:text-slate-300">正在加载评分...</div> : null}
        {error ? <div className="mt-6 rounded-3xl bg-danger-100 px-4 py-4 text-sm text-danger-700">{error}</div> : null}

        {score ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.75rem] border border-line bg-white/85 p-5 dark:border-white/10 dark:bg-slate-950/40">
              <h3 className="text-lg font-semibold text-ink-950 dark:text-white">多维度评分图表</h3>
              <div className="mt-6">
                <ScoreChart overallScore={score.overallScore} skillScore={score.skillScore} experienceScore={score.experienceScore} educationScore={score.educationScore} />
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-line bg-white/85 p-5 dark:border-white/10 dark:bg-slate-950/40">
              <h3 className="text-lg font-semibold text-ink-950 dark:text-white">AI 评语</h3>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-ink-600 dark:text-slate-300">{score.aiComment}</p>
            </div>
          </div>
        ) : !loading ? (
          <div className="mt-6 rounded-3xl bg-slate-100 px-4 py-4 text-sm text-ink-600 dark:bg-slate-900/60 dark:text-slate-300">暂无评分，点击“重新评分”开始生成。</div>
        ) : null}
      </section>
    </main>
  );
}
