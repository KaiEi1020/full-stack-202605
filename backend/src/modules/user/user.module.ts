import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserQueryService } from './application/user-query.service';
import { RegisterUserService } from './application/register-user.service';
import { UserEntity } from './infrastructure/persistence/entities/user.entity';
import { USER_REPOSITORY } from './domain/user.repository';
import { TypeOrmUserRepository } from './infrastructure/typeorm-user.repository';
import { SmsNotificationPublisher } from './infrastructure/sms-notification.publisher';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserQueryService,
    RegisterUserService,
    SmsNotificationPublisher,
    TypeOrmUserRepository,
    { provide: USER_REPOSITORY, useExisting: TypeOrmUserRepository },
  ],
})
export class UserModule {}
