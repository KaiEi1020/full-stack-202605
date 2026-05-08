import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CandidateScoreModel {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  jobRequirementId: string | null;

  @Field(() => String)
  jdText: string;

  @Field(() => Int)
  overallScore: number;

  @Field(() => Int)
  skillScore: number;

  @Field(() => Int)
  experienceScore: number;

  @Field(() => Int)
  educationScore: number;

  @Field(() => String)
  aiComment: string;

  @Field(() => Date)
  scoredAt: Date;
}
