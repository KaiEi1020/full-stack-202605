import { useState } from 'react';
import type { UploadResponse } from '../types/screening';

export function useResumeUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (
    file: File,
    jdText: string,
    requiredSkills: string[],
    preferredSkills: string[],
  ): Promise<UploadResponse> => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
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
      return (await response.json()) as UploadResponse;
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
