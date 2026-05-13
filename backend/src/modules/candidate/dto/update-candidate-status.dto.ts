import { CandidateStatus } from '../entities';

export class UpdateCandidateStatusDto {
  candidateId!: string;
  status!: CandidateStatus;
}
