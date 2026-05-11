import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('job_requirements')
export class JobRequirementEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  title!: string;

  @Column('text')
  description!: string;

  @Column('text')
  requiredSkillsJson!: string;

  @Column('text')
  preferredSkillsJson!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
