import { CandidateStatus } from '../entities';

export class UpdateCandidateStatusInput {
  candidateId!: string;
  status!: CandidateStatus;
}
