import { useState } from 'react';
import type { UploadBatchResponse } from '../types/screening';

export function useResumeUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (
    files: File[],
    jdText: string,
    requiredSkills: string[],
    preferredSkills: string[],
  ): Promise<UploadBatchResponse> => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      formData.append('jdText', jdText);
      formData.append('requiredSkills', JSON.stringify(requiredSkills));
      formData.append('preferredSkills', JSON.stringify(preferredSkills));
      const response = await fetch('/api/resumes', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || '上传失败');
      }
      return (await response.json()) as UploadBatchResponse;
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : '上传失败';
      setError(message);
      throw uploadError;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error };
}
