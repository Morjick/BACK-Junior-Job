import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/auth/auth.model';
import { Articles } from './articles.model';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
  imports: [SequelizeModule.forFeature([User, Articles])],
})
export class ArticlesModule {}
