import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity({ tableName: 'jobs' })
export class JobEntity {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @Property()
  title!: string;

  @Property()
  description!: string;

  @Property()
  requiredSkillsJson!: string;

  @Property()
  preferredSkillsJson!: string;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onUpdate: () => new Date() })
  updatedAt!: Date;
}
