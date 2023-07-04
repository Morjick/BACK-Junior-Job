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

  @ApiProperty({ example: 1, description: 'ID откликнувшегося пользователя' })
  @Column({ type: DataType.INTEGER })
  userId: number;

  @ApiProperty({ example: '', description: 'ID вакансии' })
  @Column({ type: DataType.INTEGER })
  vacancyId: number;
}
