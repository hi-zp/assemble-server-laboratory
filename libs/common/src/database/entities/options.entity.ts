import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';

@Entity()
export class Options extends BaseEntity {
  @Property({ index: true })
  name!: string;

  @Property()
  description!: string;
}
