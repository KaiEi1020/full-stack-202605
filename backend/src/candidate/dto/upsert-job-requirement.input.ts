import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpsertJobRequirementInput {
  @Field({ nullable: true })
  id?: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [String])
  requiredSkills: string[];

  @Field(() => [String])
  preferredSkills: string[];
}
