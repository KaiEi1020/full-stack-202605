import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserQueryService } from './application/user-query.service';
import { RegisterUserService } from './application/register-user.service';
import { User } from './models/user.model';
import { RegisterUserInput } from './register-user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly registerUserService: RegisterUserService,
  ) {}

  @Query(() => [User])
  users(): Promise<User[]> {
    return this.userQueryService.findAll();
  }

  @Query(() => User, { nullable: true })
  user(@Args('id') id: string): Promise<User | null> {
    return this.userQueryService.findById(id);
  }

  @Mutation(() => User)
  registerUser(@Args('input') input: RegisterUserInput): Promise<User> {
    return this.registerUserService.execute(input);
  }
}
