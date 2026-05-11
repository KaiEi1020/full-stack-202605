import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../domain/user.repository';
import { USER_REPOSITORY } from '../domain/user.repository';
import { User } from '../models/user.model';
import { SmsNotificationPublisher } from '../infrastructure/sms-notification.publisher';
import { RegisterUserInput } from '../register-user.input';

@Injectable()
export class RegisterUserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private readonly smsNotificationPublisher: SmsNotificationPublisher,
  ) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const name = input.name.trim();
    const phone = input.phone.trim();

    const existingUser = await this.userRepository.findByPhone(phone);
    if (existingUser) {
      throw new ConflictException('手机号已存在');
    }

    const user = await this.userRepository.create({
      name,
      phone,
      email: `${phone}@example.com`,
    });

    this.smsNotificationPublisher.publishUserRegistered({
      userId: user.id,
      name: user.name,
      phone: user.phone,
    });

    return user;
  }
}
