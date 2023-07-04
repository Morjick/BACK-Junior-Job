import { Module } from '@nestjs/common';
import { RespondController } from './respond.controller';
import { RespondService } from './respond.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/auth/auth.model';
import { Respond } from './models/respond.model';

@Module({
  controllers: [RespondController],
  providers: [RespondService],
  imports: [SequelizeModule.forFeature([User, Respond])],
})
export class ArticlesModule {}
