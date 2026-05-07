import { PrismaUserRepository } from '../infrastructure/prisma-user.repository';
import { UserQueryService } from './user-query.service';

describe('UserQueryService', () => {
  const users = [{ id: '1', name: 'Ada Lovelace', email: 'ada@example.com' }];
  const userRepository = {
    findAll: jest.fn().mockResolvedValue(users),
    findById: jest.fn().mockResolvedValue(users[0]),
  } as unknown as PrismaUserRepository;

  let service: UserQueryService;

  beforeEach(() => {
    service = new UserQueryService(userRepository);
  });

  it('delegates findAll to the repository path', async () => {
    await expect(service.findAll()).resolves.toEqual(users);
  });

  it('delegates findById to the repository path', async () => {
    await expect(service.findById('1')).resolves.toEqual(users[0]);
  });
});
