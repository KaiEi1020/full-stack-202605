import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export type CandidateEvent = {
  id: string;
  candidateId: string;
  jobId?: string | null;
  type: string;
  stage: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

@Injectable()
export class SseEventsService {
  private readonly subjects = new Map<string, Subject<CandidateEvent>>();

  getStream(candidateId: string): Subject<CandidateEvent> {
    const existing = this.subjects.get(candidateId);
    if (existing) {
      return existing;
    }
    const created = new Subject<CandidateEvent>();
    this.subjects.set(candidateId, created);
    return created;
  }

  emit(candidateId: string, event: CandidateEvent) {
    this.getStream(candidateId).next(event);
  }
}
