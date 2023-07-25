import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SetExecutorDto {
  @ApiProperty({ example: '', description: 'ID вакансии' })
  @IsNumber(
    {},
    {
      message: 'ID должно быть числом',
    },
  )
  readonly vacancyId: number;

  @ApiProperty({
    example: '',
    description: 'ID пользователя, выбранного на роль исполнителя',
  })
  @IsNumber(
    {},
    {
      message: 'ID должно быть числом',
    },
  )
  readonly executorId: number;
}
