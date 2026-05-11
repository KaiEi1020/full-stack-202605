import { useMemo, useState } from 'react';

type UploadFormProps = {
  onSubmit: (files: File[], jdText: string, requiredSkills: string[], preferredSkills: string[]) => Promise<void>;
  isUploading: boolean;
};

const MAX_FILES = 5;

function inputClassName() {
  return 'w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-accent-300 focus:ring-4 focus:ring-accent-100 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500';
}

export function UploadForm({ onSubmit, isUploading }: UploadFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [jdText, setJdText] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('React, TypeScript');
  const [preferredSkills, setPreferredSkills] = useState('GraphQL, NestJS');
  const [error, setError] = useState<string | null>(null);

  const selectedCountLabel = useMemo(() => {
    if (!files.length) {
      return `未选择文件（最多 ${MAX_FILES} 份）`;
    }
    return `已选择 ${files.length} 份文件`;
  }, [files]);

  const handleFilesChange = (nextFiles: File[]) => {
    if (!nextFiles.length) {
      setFiles([]);
      setError(null);
      return;
    }
    if (nextFiles.length > MAX_FILES) {
      setError(`单次最多上传 ${MAX_FILES} 份简历`);
      return;
    }
    if (nextFiles.some((file) => file.type !== 'application/pdf')) {
      setError('仅支持 PDF 文件');
      return;
    }
    setError(null);
    setFiles(nextFiles);
  };

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, currentIndex) => currentIndex !== index));
    setError(null);
  };

  return (
    <form
      className="grid gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!files.length) {
          setError('请先选择至少一份 PDF 简历');
          return;
        }
        await onSubmit(
          files,
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
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-500">Resume intake</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">批量上传简历</h2>
        </div>
        <span className="rounded-full border border-line bg-white/70 px-3 py-1 font-mono text-xs text-ink-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">POST /api/resumes</span>
      </div>

      <label className="grid cursor-pointer gap-2 rounded-[1.75rem] border border-dashed border-accent-300 bg-accent-100/40 px-5 py-6 transition hover:border-accent-400 dark:bg-accent-500/10">
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={(event) => handleFilesChange(Array.from(event.target.files ?? []))}
          hidden
        />
        <span className="text-sm font-medium text-ink-700 dark:text-slate-200">拖拽或点击上传 PDF 简历</span>
        <strong className="text-base font-semibold text-ink-950 dark:text-white">{selectedCountLabel}</strong>
        <span className="text-xs text-ink-500 dark:text-slate-400">支持多选，单次最多 5 份</span>
      </label>

      <div className="rounded-[1.75rem] border border-line bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/60">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-ink-800 dark:text-slate-200">已选文件</p>
          <span className="text-xs text-ink-500 dark:text-slate-400">{files.length}/{MAX_FILES}</span>
        </div>
        {files.length ? (
          <ul className="grid gap-2">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm shadow-sm dark:bg-slate-900/80">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink-950 dark:text-white">{file.name}</p>
                  <p className="text-xs text-ink-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button type="button" className="rounded-full border border-line px-3 py-1 text-xs text-ink-600 transition hover:border-danger-300 hover:text-danger-600 dark:border-white/10 dark:text-slate-300" onClick={() => removeFile(index)}>
                  移除
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-line px-4 py-5 text-sm text-ink-500 dark:border-white/10 dark:text-slate-400">尚未选择文件</div>
        )}
      </div>

      <div className="grid gap-5">
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

      {error ? <div className="rounded-3xl bg-danger-100 px-4 py-3 text-sm text-danger-700">{error}</div> : null}

      <div className="flex items-center justify-end gap-3">
        <button type="submit" className="inline-flex items-center rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-500 disabled:cursor-not-allowed disabled:bg-slate-400" disabled={isUploading}>
          {isUploading ? '上传中...' : '开始上传'}
        </button>
      </div>
    </form>
  );
}
