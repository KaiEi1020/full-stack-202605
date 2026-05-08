import { Injectable, Logger } from '@nestjs/common';

export type UserRegisteredMessage = {
  userId: string;
  name: string;
  phone: string;
};

@Injectable()
export class SmsNotificationPublisher {
  private readonly logger = new Logger(SmsNotificationPublisher.name);

  async publishUserRegistered(message: UserRegisteredMessage): Promise<void> {
    this.logger.log(`RabbitMQ publish user.registered ${JSON.stringify(message)}`);
    this.sendSms(message);
  }

  private sendSms(message: UserRegisteredMessage): void {
    this.logger.log(`SMS to ${message.phone}: ${message.name}，注册成功`);
  }
}
