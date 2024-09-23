import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req, InternalServerErrorException,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { TrainingService } from './training.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import {ChatgptService} from "../chatgpt/chatgpt.service";

@Controller('training')
export class TrainingController {
  constructor(
    private readonly trainingService: TrainingService,
    private readonly usersService: UsersService,
    private readonly chatGpt: ChatgptService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createTrainingDto: CreateTrainingDto, @Req() req: any) {
    const user = await this.usersService.findOne(req.user.id);

    if (!user) {
      throw new InternalServerErrorException('User not found');
    }


    console.log(createTrainingDto);
    return this.trainingService.create(createTrainingDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.trainingService.findAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Req() req: any)  {
    const user = await this.usersService.findByEmail(req.user.email);
    return this.trainingService.findOneByUserId(+id, user.id);
  }

  @Post('/start')
  @UseGuards(JwtAuthGuard)
  async start(@Body() payload: any, @Req() req: any)  {
    const user = await this.usersService.findByEmail(req.user.email);
    const training = await this.trainingService.findOneByUserId(+payload.id, user.id);

    if (!training) {
      throw new InternalServerErrorException('Training not found');
    }


    const words = this.getWordsToString(training.items);
    const response = await this.chatGpt.sendMessage(`Here are the words I would like to improve in: ${words}`);
    console.log(response);


    return response;
  }

  getWordsToString(array: string[]) {
    return array.join(', ')
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrainingDto: UpdateTrainingDto) {
    return this.trainingService.update(+id, updateTrainingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingService.remove(+id);
  }
}
