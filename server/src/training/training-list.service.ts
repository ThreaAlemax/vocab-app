// src/training/training-list.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingList } from './entities/training-list.entity';
import { Training } from './entities/training.entity';

@Injectable()
export class TrainingListService {
  constructor(
    @InjectRepository(TrainingList)
    private trainingListRepository: Repository<TrainingList>,
  ) {}

  async create(type: string, training: Training, response: any) {
    const trainingList = this.trainingListRepository.create({
      type: type,
      items: response,
      training: training,
    });

    try {
      return await this.trainingListRepository.save(trainingList);
    } catch (error) {
      throw new InternalServerErrorException('Failed to save Training List');
    }
  }

  async findOneByIdAndType(id: number, type: string): Promise<TrainingList | undefined> {
    return this.trainingListRepository.findOne({ where: { training: { id: id }, type: type } });
  }
}