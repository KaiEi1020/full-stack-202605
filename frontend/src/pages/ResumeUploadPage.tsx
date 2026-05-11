import { useEffect, useState } from 'react';
import { Toast } from '../components/Toast';
import { ScreeningProgress } from '../components/ScreeningProgress';
import { UploadForm } from '../components/UploadForm';
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

  return (
    <>
      {toastMessage ? <Toast message={toastMessage} /> : null}
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-12">
        <UploadForm
          isUploading={isUploading}
          onSubmit={async (files, jdText, requiredSkills, preferredSkills) => {
            const result = await upload(files, jdText, requiredSkills, preferredSkills);
            setCandidateId(result[0]?.resumeId ?? null);
            setToastMessage(SUCCESS_MESSAGE);
          }}
        />
        <ScreeningProgress events={events} error={error ?? streamError} candidateId={candidateId} />
      </main>
    </>
  );
}
