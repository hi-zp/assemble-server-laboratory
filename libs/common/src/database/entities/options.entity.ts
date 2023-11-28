import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';

@Entity()
export class Options extends BaseEntity {
  @Property({ index: true, unique: true })
  name!: string;

  @Property({ type: 'text', nullable: true })
  value?: string;

  @Property()
  description!: string;

  constructor(partial?: Partial<Options>) {
    super();
    Object.assign(this, partial);
  }
}
