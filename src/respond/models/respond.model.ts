import { ApiProperty } from '@nestjs/swagger';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Respond extends Model {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Очень хочу работать',
    description: 'Комментарий к отклику',
  })
  @Column({ type: DataType.TEXT })
  body: string;

  @ApiProperty({ example: 1, description: 'ID откликнувшегося пользователя' })
  @Column({ type: DataType.INTEGER })
  userId: number;

  @ApiProperty({ example: 1, description: 'ID вакансии' })
  @Column({ type: DataType.INTEGER })
  vacancyId: number;
}
