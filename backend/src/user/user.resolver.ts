import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  users(): User[] {
    return this.userService.findAll();
  }

  @Query(() => User, { nullable: true })
  user(@Args('id') id: string): User | null {
    return this.userService.findById(id);
  }
}
