import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../auth/auth.model';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, JwtService],
  imports: [SequelizeModule.forFeature([User])],
})
export class SettingsModule {}
