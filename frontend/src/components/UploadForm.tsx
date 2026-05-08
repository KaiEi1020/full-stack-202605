import { useMemo, useState } from 'react';

type UploadFormProps = {
  onSubmit: (file: File, jdText: string, requiredSkills: string[], preferredSkills: string[]) => Promise<void>;
  isUploading: boolean;
};

function inputClassName() {
  return 'w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-accent-300 focus:ring-4 focus:ring-accent-100 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500';
}

export function UploadForm({ onSubmit, isUploading }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('React, TypeScript');
  const [preferredSkills, setPreferredSkills] = useState('GraphQL, NestJS');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileName = useMemo(() => file?.name ?? '未选择文件', [file]);

  const handleFileChange = (nextFile: File | null) => {
    if (!nextFile) {
      setFile(null);
      setPreviewUrl(null);
      setError(null);
      return;
    }
    if (nextFile.type !== 'application/pdf') {
      setError('仅支持 PDF 文件');
      return;
    }
    setError(null);
    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
  };

  return (
    <form
      className="rounded-4xl border border-line bg-white/80 p-6 shadow-soft backdrop-blur xl:p-8 dark:border-white/10 dark:bg-white/5"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!file) {
          setError('请先选择一个 PDF 文件');
          return;
        }
        await onSubmit(
          file,
          jdText,
          requiredSkills
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          preferredSkills
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
        );
      }}
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">Resume intake</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">上传简历并开始筛选</h2>
        </div>
        <span className="rounded-full border border-line bg-white/70 px-3 py-1 font-mono text-xs text-ink-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">POST /api/resumes</span>
      </div>

      <label className="grid cursor-pointer gap-2 rounded-[1.75rem] border border-dashed border-accent-300 bg-accent-100/40 px-5 py-6 transition hover:border-accent-400 dark:bg-accent-500/10">
        <input type="file" accept="application/pdf" onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)} hidden />
        <span className="text-sm font-medium text-ink-700 dark:text-slate-200">{file ? '重新选择 PDF' : '拖拽或点击上传 PDF 简历'}</span>
        <strong className="text-base font-semibold text-ink-950 dark:text-white">{fileName}</strong>
      </label>

      <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-line bg-slate-50 dark:border-white/10 dark:bg-slate-950/60">
        {previewUrl ? (
          <iframe title="PDF preview" className="min-h-80 w-full bg-white dark:bg-slate-950" src={previewUrl} />
        ) : (
          <div className="flex min-h-80 items-center justify-center px-6 text-sm text-ink-500 dark:text-slate-300">上传后显示首页预览</div>
        )}
      </div>

      <div className="mt-5 grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink-800 dark:text-slate-200">岗位描述</span>
          <textarea className={`${inputClassName()} min-h-36 resize-y`} value={jdText} onChange={(event) => setJdText(event.target.value)} rows={5} placeholder="输入岗位描述" />
        </label>

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-ink-800 dark:text-slate-200">必备技能</span>
            <input className={inputClassName()} value={requiredSkills} onChange={(event) => setRequiredSkills(event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-ink-800 dark:text-slate-200">加分技能</span>
            <input className={inputClassName()} value={preferredSkills} onChange={(event) => setPreferredSkills(event.target.value)} />
          </label>
        </div>
      </div>

      {error ? <div className="mt-5 rounded-3xl bg-danger-100 px-4 py-3 text-sm text-danger-700">{error}</div> : null}

      <button type="submit" className="mt-6 inline-flex items-center rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-500 disabled:cursor-not-allowed disabled:bg-slate-400" disabled={isUploading}>
        {isUploading ? '上传中...' : '开始上传'}
      </button>
    </form>
  );
}
