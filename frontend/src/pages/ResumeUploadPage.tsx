import { useEffect, useMemo, useState } from 'react';
import { Toast } from '../components/Toast';
import { ScreeningProgress } from '../components/ScreeningProgress';
import { UploadForm } from '../components/UploadForm';
import { navigate } from '../App';
import { useResumeUpload } from '../hooks/useResumeUpload';
import { useScreeningEvents } from '../hooks/useScreeningEvents';

const SUCCESS_MESSAGE = '简历上传成功, 交给大模型解析中...';

export function ResumeUploadPage() {
  const { upload, isUploading, error } = useResumeUpload();
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { events, error: streamError } = useScreeningEvents(candidateId);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const isProcessing = useMemo(() => {
    if (!candidateId) {
      return false;
    }

    return !events.some((event) => event.type === 'completed' && event.stage === 'completed') && !events.some((event) => event.type === 'failed');
  }, [candidateId, events]);

  return (
    <>
      {toastMessage ? <Toast message={toastMessage} /> : null}
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-12">
        <div className="grid gap-6">
          <UploadForm
            isUploading={isUploading}
            onSubmit={async (file, jdText, requiredSkills, preferredSkills) => {
              const result = await upload(file, jdText, requiredSkills, preferredSkills);
              setCandidateId(result.candidateId);
              setToastMessage(SUCCESS_MESSAGE);
            }}
          />

          {isProcessing ? (
            <section className="rounded-4xl border border-accent-200 bg-accent-100/60 p-5 shadow-soft dark:border-accent-400/30 dark:bg-accent-500/10">
              <div className="flex items-start gap-4">
                <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-accent-500 dark:bg-slate-950/70">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-ink-950 dark:text-white">后台正在处理简历</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-slate-300">简历已经上传成功，系统正在解析 PDF、提取关键信息并生成岗位匹配结果。</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-full bg-ink-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-500"
                      onClick={() => navigate('/candidates')}
                    >
                      前往候选人管理面板
                    </button>
                    {candidateId ? (
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-semibold text-ink-800 transition hover:border-accent-300 hover:text-accent-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                        onClick={() => navigate('/candidate', `?id=${candidateId}`)}
                      >
                        查看当前候选人详情
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          ) : null}
        </div>
        <ScreeningProgress events={events} error={error ?? streamError} />
      </main>
    </>
  );
}
