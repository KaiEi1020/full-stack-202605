export type UploadResponse = {
  resumeId: string;
  candidateId: string;
  jobId: string;
};

export type ScreeningEvent = {
  id: string;
  candidateId: string;
  resumeId?: string | null;
  jobId?: string | null;
  type: string;
  stage: string;
  payload: Record<string, unknown>;
  createdAt: string;
};
