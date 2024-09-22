import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeUpdate,
  BeforeInsert,
  OneToMany,
} from 'typeorm';

import { Training } from '../training/entities/training.entity';
import * as bcrypt from 'bcryptjs';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Only hash the password if it's new or modified
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @OneToMany(() => Training, (training) => training.user)
  trainings: Training[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  modified_at: Date;
}
