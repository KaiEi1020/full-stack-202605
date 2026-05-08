import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ScoreCandidateInput {
  @Field()
  candidateId: string;

  @Field({ nullable: true })
  jobRequirementId?: string;

  @Field()
  jdText: string;

  @Field(() => [String])
  requiredSkills: string[];

  @Field(() => [String])
  preferredSkills: string[];
}
