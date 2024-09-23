import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Users } from '../../users/users.entity';
import { TrainingList } from './training-list.entity';
import { TrainingResult } from './training-result.entity';

@Entity()
export class Training {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.trainings)
  @JoinColumn({ name: 'users_id' })
  user: Users;

  @Column()
  type: string;

  @Column()
  name: string;

  @Column('json', { nullable: false })
  items: string[];

  @OneToMany(() => TrainingList, (trainingList) => trainingList.training)
  trainingLists: TrainingList[];

  @OneToOne(() => TrainingResult, (trainingResult) => trainingResult.training)
  trainingResult: TrainingResult;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  modified_at: Date;
}
