import { Module } from '@nestjs/common';
import { UserQueryService } from './application/user-query.service';
import { RegisterUserService } from './application/register-user.service';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository';
import { SmsNotificationPublisher } from './infrastructure/sms-notification.publisher';
import { UserResolver } from './user.resolver';

@Module({
  providers: [
    UserResolver,
    UserQueryService,
    RegisterUserService,
    PrismaUserRepository,
    SmsNotificationPublisher,
  ],
})
export class UserModule {}
