import { PartialType } from '@nestjs/mapped-types';
import { CreateTrainingDto } from './create-training.dto';

export class UpdateTrainingDto extends PartialType(CreateTrainingDto) {
  name?: string;
  type?: string;
  items?: string[];
}
