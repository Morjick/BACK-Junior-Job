import { Module } from '@nestjs/common';
import { VacancyController } from './vacancy.controller';
import { VacancyService } from './vacancy.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { VacancyCategory } from './models/category.model';
import { Vacancy } from './models/vacancy.model';
import { User } from '../auth/auth.model';

@Module({
  controllers: [VacancyController],
  providers: [VacancyService],
  imports: [SequelizeModule.forFeature([VacancyCategory, Vacancy, User])],
})
export class VacancyModule {}
