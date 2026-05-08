import { Field, InputType } from '@nestjs/graphql';
import { CandidateStatusEnum } from '../models/candidate-status.enum';

@InputType()
export class UpdateCandidateStatusInput {
  @Field()
  candidateId: string;

  @Field(() => CandidateStatusEnum)
  status: CandidateStatusEnum;
}
