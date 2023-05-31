import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Apeal } from './models/apeal.model';

@Module({
  controllers: [SupportController],
  providers: [SupportService],
  imports: [SequelizeModule.forFeature([Apeal])],
})
export class SupportModule {}
