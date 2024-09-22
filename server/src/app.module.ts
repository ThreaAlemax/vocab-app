import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { Users } from './users/users.entity';
import { Training } from './training/entities/training.entity';
import { TrainingList } from './training/entities/training-list.entity';
import { AuthModule } from './auth/auth.module';
import { TrainingController } from './training/training.controller';
import { TrainingService } from './training/training.service';
import { TrainingModule } from './training/training.module';
import { TrainingResult } from './training/entities/training-result.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      username: 'root',
      password: 'root',
      database: 'robbie',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Automatically sync the database schema (good for development)
    }),
    UsersModule,
    AuthModule,
    TrainingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
