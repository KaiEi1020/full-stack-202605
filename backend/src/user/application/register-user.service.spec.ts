import { ConflictException } from '@nestjs/common';
import { RegisterUserService } from './register-user.service';
import { UserRepository } from '../domain/user.repository';
import { SmsNotificationPublisher } from '../infrastructure/sms-notification.publisher';

describe('RegisterUserService', () => {
  const createdUser = {
    id: '1',
    name: 'Ada',
    email: '13800000000@example.com',
    phone: '13800000000',
  };

  const userRepository = {
    findByPhone: jest.fn(),
    create: jest.fn(),
  } as unknown as UserRepository;

  const smsNotificationPublisher = {
    publishUserRegistered: jest.fn(),
  } as unknown as SmsNotificationPublisher;

  let service: RegisterUserService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new RegisterUserService(userRepository, smsNotificationPublisher);
  });

  it('creates a user and publishes notification', async () => {
    jest.spyOn(userRepository, 'findByPhone').mockResolvedValue(null);
    jest.spyOn(userRepository, 'create').mockResolvedValue(createdUser);

    await expect(
      service.execute({ name: ' Ada ', phone: '13800000000' }),
    ).resolves.toEqual(createdUser);
    expect(userRepository.create).toHaveBeenCalledWith({
      name: 'Ada',
      phone: '13800000000',
      email: '13800000000@example.com',
    });
    expect(smsNotificationPublisher.publishUserRegistered).toHaveBeenCalledWith(
      {
        userId: '1',
        name: 'Ada',
        phone: '13800000000',
      },
    );
  });

  it('rejects duplicate phone registration', async () => {
    jest.spyOn(userRepository, 'findByPhone').mockResolvedValue(createdUser);

    await expect(
      service.execute({ name: 'Ada', phone: '13800000000' }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(userRepository.create).not.toHaveBeenCalled();
    expect(
      smsNotificationPublisher.publishUserRegistered,
    ).not.toHaveBeenCalled();
  });
});
