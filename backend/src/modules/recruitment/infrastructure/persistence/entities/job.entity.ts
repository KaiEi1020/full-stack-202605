import { Entity, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '../../../../../common/entities/base.entity';

@Entity({ tableName: 'jobs' })
export class JobEntity extends BaseEntity {
  @Property()
  title: string = '';

  @Property()
  description: string = '';

  @Property()
  requiredSkillsJson: string = '';

  @Property()
  preferredSkillsJson: string = '';
}
