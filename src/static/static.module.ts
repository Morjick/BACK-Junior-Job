import { Module } from '@nestjs/common';
import { StaticService } from './static.service';
import { StaticController } from './static.controller';

@Module({
  providers: [StaticService],
  controllers: [StaticController],
})
export class StaticModule {}
