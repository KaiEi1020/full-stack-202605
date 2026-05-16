import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { SubmissionStatus } from '../../../domain/vo/submission-status.enum';
import { ScreeningStatus } from '../../../domain/vo/screening-status.enum';

@Entity({ tableName: 'applications' })
export class JobApplicationEntity {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @Property()
  jobId!: string;

  @Property()
  resumeId!: string;

  @Property({ default: SubmissionStatus.PENDING })
  status!: SubmissionStatus;

  @Property({ default: ScreeningStatus.PENDING })
  screeningStatus!: ScreeningStatus;

  @Property({ nullable: true })
  screeningStage!: string | null;

  @Property({ nullable: true })
  screeningErrorMessage!: string | null;

  @Property({ type: 'timestamptz', nullable: true })
  screeningStartedAt!: Date | null;

  @Property({ type: 'timestamptz', nullable: true })
  screeningFinishedAt!: Date | null;

  @Property({ type: 'integer', nullable: true })
  overallScore!: number | null;

  @Property({ type: 'integer', nullable: true })
  skillScore!: number | null;

  @Property({ type: 'integer', nullable: true })
  experienceScore!: number | null;

  @Property({ type: 'integer', nullable: true })
  educationScore!: number | null;

  @Property({ nullable: true })
  aiComment!: string | null;

  @Property({ nullable: true })
  scoreHistoryJson!: string | null;

  @Property({ nullable: true })
  eventHistoryJson!: string | null;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onUpdate: () => new Date() })
  updatedAt!: Date;
}
