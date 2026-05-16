import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserQueryService } from './application/user-query.service';
import { RegisterUserService } from './application/register-user.service';
import { UserEntity } from './infrastructure/persistence/entities/user.entity';
import { USER_REPOSITORY } from './domain/user.repository';
import { MikroOrmUserRepository } from './infrastructure/repositories/mikroorm-user.repository';
import { SmsNotificationPublisher } from './infrastructure/sms-notification.publisher';
import { UserController } from './user.controller';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserQueryService,
    RegisterUserService,
    SmsNotificationPublisher,
    MikroOrmUserRepository,
    { provide: USER_REPOSITORY, useExisting: MikroOrmUserRepository },
  ],
})
export class UserModule {}
