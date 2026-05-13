import { CandidateStatus } from '../../../core/database/candidate-status.enum';

export class UpdateCandidateStatusInput {
  candidateId!: string;
  status!: CandidateStatus;
}
