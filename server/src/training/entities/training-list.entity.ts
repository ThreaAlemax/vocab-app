import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Training } from './training.entity';

@Entity()
export class TrainingList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column('json', { nullable: false })
  items: any;

  @ManyToOne(() => Training, (training) => training.trainingLists)
  @JoinColumn({ name: 'training_id' })
  training: Training;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  modified_at: Date;
}
