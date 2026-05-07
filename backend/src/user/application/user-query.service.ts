import { Injectable } from '@nestjs/common';
import { PrismaUserRepository } from '../infrastructure/prisma-user.repository';
import { User } from '../models/user.model';

@Injectable()
export class UserQueryService {
  constructor(private readonly userRepository: PrismaUserRepository) {}

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}
