import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/auth/auth.model';
import { Vacancy } from 'src/vacancy/models/vacancy.model';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  imports: [SequelizeModule.forFeature([User, Vacancy])],
})
export class FavoritesModule {}
