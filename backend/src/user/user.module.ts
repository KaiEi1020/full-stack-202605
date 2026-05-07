import { Module } from '@nestjs/common';
import { UserQueryService } from './application/user-query.service';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository';
import { UserResolver } from './user.resolver';

@Module({
  providers: [UserResolver, UserQueryService, PrismaUserRepository],
})
export class UserModule {}
