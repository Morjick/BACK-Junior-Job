import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { User } from './auth/auth.model';
import { ArticlesModule } from './articles/articles.module';
import { Articles } from './articles/articles.model';
import { VacancyModule } from './vacancy/vacancy.module';
import { VacancyCategory } from './vacancy/models/category.model';
import { Vacancy } from './vacancy/models/vacancy.model';
import { SupportModule } from './support/support.module';
import { Apeal } from './support/models/apeal.model';
import { ResponseModule } from './response/response.module';
import { ResponseModel } from './response/models/response.model';
import { SettingsModule } from './settings/settings.module';
import { StaticModule } from './static/static.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: String(process.env.DB_PASSWORD),
      database: process.env.DB_NAME,
      models: [User, Articles, VacancyCategory, Vacancy, Apeal, ResponseModel],
      autoLoadModels: true,
      synchronize: true,
      sync: {
        alter: true,
      },
      logging: false,
    }),
    AuthModule,
    ArticlesModule,
    VacancyModule,
    SupportModule,
    ResponseModule,
    SettingsModule,
    StaticModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
