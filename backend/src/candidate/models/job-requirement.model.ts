import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JobRequirementModel {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => [String])
  requiredSkills: string[];

  @Field(() => [String])
  preferredSkills: string[];
}
