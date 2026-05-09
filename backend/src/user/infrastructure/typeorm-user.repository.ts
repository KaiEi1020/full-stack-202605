import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database';
import { CreateUserInput, UserRepository } from '../domain/user.repository';
import { User } from '../models/user.model';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.repository.find({ order: { id: 'asc' } });
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.repository.findOne({ where: { phone } });
  }

  async create(input: CreateUserInput): Promise<User> {
    const entity = this.repository.create({
      id: randomUUID(),
      name: input.name,
      email: input.email,
      phone: input.phone,
    });
    return this.repository.save(entity);
  }
}
