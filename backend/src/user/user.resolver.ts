import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserQueryService } from './application/user-query.service';
import { User } from './models/user.model';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userQueryService: UserQueryService) {}

  @Query(() => [User])
  users(): Promise<User[]> {
    return this.userQueryService.findAll();
  }

  @Query(() => User, { nullable: true })
  user(@Args('id') id: string): Promise<User | null> {
    return this.userQueryService.findById(id);
  }
}
