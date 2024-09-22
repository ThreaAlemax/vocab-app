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

@Controller('training')
export class TrainingController {
  constructor(
    private readonly trainingService: TrainingService,
    private readonly usersService: UsersService,
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingService.findOne(+id);
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
