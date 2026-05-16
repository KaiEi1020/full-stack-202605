export type UploadResponse = {
  applicationId: string;
  jobId: string;
  resumeId: string;
};

export type UploadBatchResponse = UploadResponse[];

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
