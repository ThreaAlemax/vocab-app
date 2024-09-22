import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { TrainingService } from './training.service';
import { TrainingController } from './training.controller';

import { Training } from './entities/training.entity';
import { TrainingList } from './entities/training-list.entity';
import { TrainingResult } from './entities/training-result.entity';
import {UsersService} from "../users/users.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Training, TrainingList, TrainingResult]),
    UsersModule,
  ],
  controllers: [TrainingController],
  providers: [TrainingService, UsersService],
  exports: [TrainingService],
})
export class TrainingModule {}
