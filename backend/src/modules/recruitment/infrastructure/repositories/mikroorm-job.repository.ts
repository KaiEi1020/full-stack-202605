import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { JobEntity } from '../persistence/entities/job.entity';
import { JobRepository } from '../../domain/repository/job.repository';

@Injectable()
export class MikroOrmJobRepository implements JobRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string): Promise<JobEntity | null> {
    return this.em.findOne(JobEntity, { id });
  }

  async findByIdOrFail(id: string): Promise<JobEntity> {
    return this.em.findOneOrFail(JobEntity, { id });
  }

  async findAll(options?: {
    orderBy?: Record<string, string>;
  }): Promise<JobEntity[]> {
    return this.em.find(JobEntity, {}, { orderBy: options?.orderBy });
  }

  async save(entity: JobEntity): Promise<void> {
    this.em.persist(entity);
    await this.em.flush();
  }

  create(data: Partial<JobEntity>): JobEntity {
    return this.em.create(JobEntity, data as Required<JobEntity>);
  }
}
