import { Injectable } from '@nestjs/common';
import { User } from './models/user.model';

@Injectable()
export class UserService {
  private readonly users: User[] = [
    { id: '1', name: 'Ada Lovelace', email: 'ada@example.com' },
    { id: '2', name: 'Grace Hopper', email: 'grace@example.com' },
    { id: '3', name: 'Linus Torvalds', email: 'linus@example.com' },
  ];

  findAll(): User[] {
    return this.users;
  }

  findById(id: string): User | null {
    return this.users.find((user) => user.id === id) ?? null;
  }
}
