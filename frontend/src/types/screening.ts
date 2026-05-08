export type UploadResponse = {
  candidateId: string;
  jobId: string;
};

export type ScreeningEvent = {
  id: string;
  candidateId: string;
  jobId?: string | null;
  type: string;
  stage: string;
  payload: Record<string, unknown>;
  createdAt: string;
};
