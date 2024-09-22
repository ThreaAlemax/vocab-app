import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Training } from './training.entity';

@Entity()
export class TrainingResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  results: string;

  @OneToOne(() => Training, (training) => training.trainingResult)
  @JoinColumn({ name: 'training_id' })
  training: Training;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  modified_at: Date;
}
