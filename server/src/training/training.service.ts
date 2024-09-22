// src/users/users.service.ts
import {Injectable, InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Training } from './entities/training.entity'; // Import the entity
import { Users } from '../users/users.entity'; // Import the entity
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';

@Injectable()
export class TrainingService {
  constructor(
    @InjectRepository(Training)
    private trainingRepository: Repository<Training>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async create(
    createTrainingDto: CreateTrainingDto,
    user: Users,
  ): Promise<{ success: boolean }> {
    // Create a new user
    const newTraining = this.trainingRepository.create({
      ...createTrainingDto,
      items: JSON.stringify(createTrainingDto.items),
      user,
    });

    try {
      const savedTraining = await this.trainingRepository.save(newTraining);
      console.log(savedTraining);
      return {
        success: true,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Failed to create Training');
    }
  }

  async findAll() {
    const trainings = await this.trainingRepository.find();
    return trainings.map(training => ({
      ...training,
      items: training.items && training.items.trim() !== "" ? JSON.parse(training.items) : [],
    }));
  }
  async findOne(id: number) {
    const training = await this.trainingRepository.findOne( { where: { id }} );
    training.items = training.items && training.items.trim() !== "" ? JSON.parse(training.items) : [];
    return training;
  }

  async update(id: number, updateTrainingDto: UpdateTrainingDto) {

    const updateData = {
      ...updateTrainingDto,
      items: JSON.stringify(updateTrainingDto.items),
    };

    return await this.trainingRepository.update(id, updateData);
  }

  remove(id: number) {
    return this.trainingRepository.delete(id);
  }
}