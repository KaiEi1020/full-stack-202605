import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '../models/user.model';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { id: 'asc' },
    });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
