import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

import { Common } from '@entity/common/common.entity';
import { User } from '@entity/user.entity';

@Entity('blocks')
export class Block extends Common {
  @PrimaryColumn('int', { name: 'source_id' })
  sourceId: number;

  @PrimaryColumn('int', { name: 'target_id' })
  targetId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'source_id', referencedColumnName: 'id' })
  sourceUser: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'target_id', referencedColumnName: 'id' })
  targetUser: User;
}
