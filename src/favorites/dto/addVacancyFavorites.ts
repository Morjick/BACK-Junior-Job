import { ApiProperty } from '@nestjs/swagger';

export class addVacancytoFavorites {
  @ApiProperty({
    example: 12,
    description: 'ID вакансии',
  })
  readonly vacancy: number;
}
