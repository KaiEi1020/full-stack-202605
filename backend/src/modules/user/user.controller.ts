import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RegisterUserService } from './application/register-user.service';
import { UserQueryService } from './application/user-query.service';
import { RegisterUserDto } from './register-user.dto';

@Controller('api/users')
export class UserController {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly registerUserService: RegisterUserService,
  ) {}

  @Get()
  users() {
    return this.userQueryService.findAll();
  }

  @Get(':id')
  user(@Param('id') id: string) {
    return this.userQueryService.findById(id);
  }

  @Post()
  registerUser(@Body() input: RegisterUserDto) {
    return this.registerUserService.execute(input);
  }
}
