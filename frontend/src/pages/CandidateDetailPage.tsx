import { useMutation, useQuery } from '@apollo/client/react';
import { CandidateStatusBadge } from '../components/CandidateStatusBadge';
import { ScoreChart } from '../components/ScoreChart';
import { getCandidateStatusMeta } from '../components/status';
import { GET_CANDIDATE, SAVE_CANDIDATE_CORRECTION, UPDATE_CANDIDATE_STATUS } from '../graphql/queries';

type CandidateDetail = {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  status: string;
  resumeSummary: string | null;
  resumeFilePath: string | null;
  cleanedText: string | null;
  skills: string[];
  scores: Array<{
    id: string;
    overallScore: number;
    skillScore: number;
    experienceScore: number;
    educationScore: number;
    aiComment: string;
  }>;
};

type CandidateDetailPageProps = {
  candidateId: string;
};

const statusOptions = ['PENDING', 'PASSED', 'INTERVIEWING', 'HIRED', 'REJECTED'] as const;

export function CandidateDetailPage({ candidateId }: CandidateDetailPageProps) {
  const { data, loading, error, refetch } = useQuery<{ candidate: CandidateDetail | null }>(GET_CANDIDATE, {
    variables: { id: candidateId },
  });
  const [updateStatus] = useMutation(UPDATE_CANDIDATE_STATUS);
  const [saveCorrection] = useMutation(SAVE_CANDIDATE_CORRECTION);

  const candidate = data?.candidate;
  const score = candidate?.scores[0];

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-4xl border border-line bg-white/80 p-6 shadow-soft backdrop-blur xl:p-8 dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">Candidate profile</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">候选人详情</h2>
          </div>
          {candidate ? <CandidateStatusBadge status={candidate.status} /> : null}
        </div>

        {loading ? <div className="mt-6 rounded-3xl bg-slate-100 px-4 py-4 text-sm text-ink-600 dark:bg-slate-900/60 dark:text-slate-300">正在加载候选人详情...</div> : null}
        {error ? <div className="mt-6 rounded-3xl bg-danger-100 px-4 py-4 text-sm text-danger-700">{error.message}</div> : null}

        {candidate ? (
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <div className="grid gap-4">
              <div className="rounded-[1.75rem] border border-line bg-white/85 p-5 dark:border-white/10 dark:bg-slate-950/40">
                <h3 className="text-xl font-semibold text-ink-950 dark:text-white">{candidate.name ?? '待提取姓名'}</h3>
                <p className="mt-2 text-sm text-ink-500 dark:text-slate-300">{candidate.email ?? '暂无邮箱'} / {candidate.phone ?? '暂无电话'} / {candidate.city ?? '暂无城市'}</p>
                <p className="mt-4 text-sm leading-7 text-ink-600 dark:text-slate-300">{candidate.resumeSummary ?? '暂无摘要'}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {candidate.skills.length > 0 ? candidate.skills.map((skill: string) => <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-ink-700 dark:bg-slate-800 dark:text-slate-200">{skill}</span>) : <span className="text-sm text-ink-500 dark:text-slate-300">暂无技能标签</span>}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-line bg-white/85 p-5 dark:border-white/10 dark:bg-slate-950/40">
                <h3 className="text-lg font-semibold text-ink-950 dark:text-white">状态流转</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink-700 transition hover:border-accent-300 hover:text-accent-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                      onClick={async () => {
                        await updateStatus({ variables: { input: { candidateId, status } } });
                        await refetch();
                      }}
                    >
                      {getCandidateStatusMeta(status).label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-line bg-white/85 p-5 dark:border-white/10 dark:bg-slate-950/40">
                <h3 className="text-lg font-semibold text-ink-950 dark:text-white">人工修正</h3>
                <p className="mt-2 text-sm text-ink-500 dark:text-slate-300">写入示例修正数据，验证人工回填链路。</p>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-500"
                  onClick={async () => {
                    await saveCorrection({ variables: { input: { candidateId, correctedJson: JSON.stringify({ updatedAt: Date.now() }) } } });
                    await refetch();
                  }}
                >
                  保存修正示例
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.75rem] border border-line bg-white/85 p-5 dark:border-white/10 dark:bg-slate-950/40">
                <h3 className="text-lg font-semibold text-ink-950 dark:text-white">PDF 预览</h3>
                <div className="mt-4 overflow-hidden rounded-3xl border border-line bg-slate-50 dark:border-white/10 dark:bg-slate-950/60">
                  {candidate.resumeFilePath ? <iframe className="min-h-80 w-full" src={`/${candidate.resumeFilePath}`} title="resume pdf" /> : <div className="flex min-h-80 items-center justify-center px-6 text-sm text-ink-500 dark:text-slate-300">暂无 PDF</div>}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-line bg-white/85 p-5 dark:border-white/10 dark:bg-slate-950/40">
                <h3 className="text-lg font-semibold text-ink-950 dark:text-white">解析文本</h3>
                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-ink-600 dark:text-slate-300">{candidate.cleanedText ?? '暂无解析结果'}</p>
              </div>

              <div className="rounded-[1.75rem] border border-line bg-white/85 p-5 dark:border-white/10 dark:bg-slate-950/40">
                <h3 className="text-lg font-semibold text-ink-950 dark:text-white">岗位匹配评分</h3>
                {score ? (
                  <>
                    <div className="mt-4">
                      <ScoreChart
                        overallScore={score.overallScore}
                        skillScore={score.skillScore}
                        experienceScore={score.experienceScore}
                        educationScore={score.educationScore}
                      />
                    </div>
                    <p className="mt-4 text-sm leading-7 text-ink-600 dark:text-slate-300">{score.aiComment}</p>
                  </>
                ) : (
                  <div className="mt-4 rounded-3xl bg-slate-100 px-4 py-4 text-sm text-ink-600 dark:bg-slate-900/60 dark:text-slate-300">暂无评分</div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
