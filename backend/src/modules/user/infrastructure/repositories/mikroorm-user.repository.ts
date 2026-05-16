import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserEntity } from '../persistence/entities/user.entity';
import { CreateUserInput, UserRepository } from '../../domain/user.repository';
import { User } from '../../models/user.model';

@Injectable()
export class MikroOrmUserRepository implements UserRepository {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<User[]> {
    const entities = await this.em.find(
      UserEntity,
      {},
      { orderBy: { id: 'asc' } },
    );
    return entities;
  }

  async findById(id: string): Promise<User | null> {
    return this.em.findOne(UserEntity, { id });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.em.findOne(UserEntity, { phone });
  }

  async create(input: CreateUserInput): Promise<User> {
    const entity = this.em.create(UserEntity, {
      id: randomUUID(),
      name: input.name,
      email: input.email,
      phone: input.phone,
    });
    this.em.persist(entity);
    await this.em.flush();
    return entity;
  }
}
