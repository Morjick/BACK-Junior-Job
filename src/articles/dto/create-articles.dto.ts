import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateArticlesDto {
  @ApiProperty({
    example: 'Стандартная статья номер 1',
    description: 'Заголовок статьи',
  })
  @Length(5, 200, {
    message:
      'Заголовок должен иметь минимум 5 символов без спецсимволов, а максимум 200',
  })
  @IsString({ message: 'Заголовок должно быть строкой!' })
  readonly title: string;

  @ApiProperty({ example: '', description: 'Тело статьи' })
  @Length(5, 200, {
    message:
      'Тело статьи должно иметь минимум 5 символов без спецсимволов, а максимум 200',
  })
  @IsString({ message: 'Имя должно быть строкой!' })
  readonly body: string;

  readonly avatar?: string;
  readonly show?: boolean;
}
