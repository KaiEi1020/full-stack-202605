import { Field, ObjectType } from '@nestjs/graphql';
import { CandidateStatusEnum } from './candidate-status.enum';
import { CandidateScoreModel } from './candidate-score.model';

@ObjectType()
export class CandidateModel {
  @Field()
  id: string;

  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => String, { nullable: true })
  phone: string | null;

  @Field(() => String, { nullable: true })
  email: string | null;

  @Field(() => String, { nullable: true })
  city: string | null;

  @Field(() => CandidateStatusEnum)
  status: CandidateStatusEnum;

  @Field(() => String, { nullable: true })
  resumeSummary: string | null;

  @Field(() => String, { nullable: true })
  resumeFilePath: string | null;

  @Field(() => String, { nullable: true })
  cleanedText: string | null;

  @Field(() => [String])
  skills: string[];

  @Field(() => [CandidateScoreModel])
  scores: CandidateScoreModel[];

  @Field(() => Date)
  createdAt: Date;
}
