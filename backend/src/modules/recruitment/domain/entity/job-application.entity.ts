import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubmissionStatus } from '../vo/submission-status.enum';
import { ScreeningStatus } from '../vo/screening-status.enum';

@Entity('applications')
export class JobApplicationEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  jobId!: string;

  @Column('text')
  resumeId!: string;

  @Column('text', { default: SubmissionStatus.PENDING })
  status!: SubmissionStatus;

  @Column('text', { default: ScreeningStatus.PENDING })
  screeningStatus!: ScreeningStatus;

  @Column('text', { nullable: true })
  screeningStage!: string | null;

  @Column('text', { nullable: true })
  screeningErrorMessage!: string | null;

  @Column('datetime', { nullable: true })
  screeningStartedAt!: Date | null;

  @Column('datetime', { nullable: true })
  screeningFinishedAt!: Date | null;

  @Column('integer', { nullable: true })
  overallScore!: number | null;

  @Column('integer', { nullable: true })
  skillScore!: number | null;

  @Column('integer', { nullable: true })
  experienceScore!: number | null;

  @Column('integer', { nullable: true })
  educationScore!: number | null;

  @Column('text', { nullable: true })
  aiComment!: string | null;

  @Column('text', { nullable: true })
  scoreHistoryJson!: string | null;

  @Column('text', { nullable: true })
  eventHistoryJson!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
