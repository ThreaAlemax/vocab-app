import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { TrainingService } from './training.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { ChatgptService } from '../chatgpt/chatgpt.service';
import { TrainingListService } from './training-list.service';

import wordsListContext from './context/words.list';

@Controller('training')
export class TrainingController {
  constructor(
    private readonly trainingService: TrainingService,
    private readonly usersService: UsersService,
    private readonly chatGpt: ChatgptService,
    private readonly trainingListService: TrainingListService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createTrainingDto: CreateTrainingDto, @Req() req: any) {
    const user = await this.usersService.findOne(req.user.id);

    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    return this.trainingService.create(createTrainingDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.trainingService.findAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Req() req: any) {
    const user = await this.usersService.findByEmail(req.user.email);
    return this.trainingService.findOneByUserId(+id, user.id);
  }

  @Post('/start')
  @UseGuards(JwtAuthGuard)
  async start(@Body() payload: any, @Req() req: any) {
    const user = await this.usersService.findByEmail(req.user.email);
    const training = await this.trainingService.findOneByUserId(
      +payload.id,
      user.id,
    );

    if (!training) {
      throw new InternalServerErrorException('Training not found');
    }

    const existingTrainingList =
      await this.trainingListService.findOneByIdAndType(
        training.id,
        'word_list',
      );

    if (existingTrainingList) {
      // if the training list already exists we do not need to get response from chatgpt
      return existingTrainingList.items;
    } else {
      const words = this.getWordsToString(training.items);
      const response = await this.chatGpt.sendMessage(
        `Words to improve in: ${words}`,
        wordsListContext,
      );

      try {
        await this.trainingListService.create(
          'word_list',
          training,
          response.message,
        );
        return JSON.parse(JSON.stringify(response.message));
      } catch (e) {
        console.log('catch:', response.message);
        return response.message;
      }
    }
  }

  getWordsToString(array: string[]) {
    return array.join(', ');
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrainingDto: UpdateTrainingDto,
  ) {
    return this.trainingService.update(+id, updateTrainingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingService.remove(+id);
  }
}
