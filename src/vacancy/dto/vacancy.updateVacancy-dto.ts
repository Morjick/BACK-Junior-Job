import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, Length } from 'class-validator';
import { User } from 'src/auth/auth.model';
import { ResponseModel } from 'src/response/models/response.model';
import { VacancyCategory } from '../models/category.model';

export class UpdateVacancyDto {
  @ApiProperty({
    example: 'Стандартная вакансия номер 1',
    description: 'Заголовок вакансии',
  })
  @IsString({ message: 'Заголовок должно быть строкой!' })
  readonly title: string;

  @ApiProperty({ example: '', description: 'Тело статьи' })
  @Length(5, 200, {
    message:
      'Тело вакансии должно иметь минимум 5 символов без спецсимволов, а максимум 200',
  })
  @IsString()
  readonly avatar?: string;

  @IsNumber()
  readonly categoryId: number;

  @IsBoolean()
  readonly show: boolean;

  @IsNumber()
  readonly autorId: number;
}
