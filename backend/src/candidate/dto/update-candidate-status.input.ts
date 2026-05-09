import { CandidateStatus } from '../../database';

export class UpdateCandidateStatusInput {
  candidateId!: string;
  status!: CandidateStatus;
}
