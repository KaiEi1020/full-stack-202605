import { registerEnumType } from '@nestjs/graphql';

export enum CandidateStatusEnum {
  PENDING = 'PENDING',
  PASSED = 'PASSED',
  INTERVIEWING = 'INTERVIEWING',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
}

registerEnumType(CandidateStatusEnum, { name: 'CandidateStatus' });
