import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaUserRepository } from '../infrastructure/prisma-user.repository';
import { User } from '../models/user.model';
import { SmsNotificationPublisher } from '../infrastructure/sms-notification.publisher';
import { RegisterUserInput } from '../register-user.input';

@Injectable()
export class RegisterUserService {
  constructor(
    private readonly userRepository: PrismaUserRepository,
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

    await this.smsNotificationPublisher.publishUserRegistered({
      userId: user.id,
      name: user.name,
      phone: user.phone,
    });

    return user;
  }
}
