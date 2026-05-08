import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SaveCandidateCorrectionInput {
  @Field()
  candidateId: string;

  @Field()
  correctedJson: string;
}
