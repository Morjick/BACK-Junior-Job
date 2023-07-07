import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, Length } from 'class-validator';

export class UpdateAuthDto {
  @ApiProperty({
    example: 'Стандартная вакансия номер 1',
    description: 'Заголовок вакансии',
  })
  @IsString({ message: 'Заголовок должно быть строкой!' })
  readonly title: string;

  @ApiProperty({ example: '', description: 'Тело статьи' })
  @Length(5, 200, {
    message:
      'Тело статьи должно иметь минимум 5 символов без спецсимволов, а максимум 200',
  })
  @IsString()
  readonly avatar?: string;

  @IsString()
  readonly firstname: string;

  @IsString()
  readonly lastname: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsBoolean()
  readonly banned: boolean;

  @IsNumber()
  readonly modarator: number;

  @IsBoolean()
  readonly modarate: boolean;

  @IsString()
  readonly implication: string;

  @IsNumber()
  readonly age: number;

  @IsString()
  readonly birsday: string;

  @IsString()
  readonly learn: string;

  @IsString()
  readonly inn: string;

  @IsString()
  readonly city: string;

  @IsString()
  readonly role: string;

  @IsString()
  readonly theme: string;
}
