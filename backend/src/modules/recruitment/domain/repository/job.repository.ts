import { JobEntity } from '../../infrastructure/persistence/entities/job.entity';

export const JOB_REPOSITORY = Symbol('JOB_REPOSITORY');

export interface JobRepository {
  findById(id: string): Promise<JobEntity | null>;
  findByIdOrFail(id: string): Promise<JobEntity>;
  findAll(options?: { orderBy?: Record<string, string> }): Promise<JobEntity[]>;
  save(entity: JobEntity): Promise<void>;
  create(data: Partial<JobEntity>): JobEntity;
}
