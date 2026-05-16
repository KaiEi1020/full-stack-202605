import { Entity, Property, Unique } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '../../../../../common/entities/base.entity';

@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity {
  @Property()
  name: string = '';

  @Property()
  @Unique()
  email: string = '';

  @Property()
  @Unique()
  phone: string = '';
}
