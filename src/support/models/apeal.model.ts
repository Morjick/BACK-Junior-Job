import { ApiProperty } from '@nestjs/swagger';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Apeal extends Model {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  phone: string;

  @Column({ type: DataType.TEXT })
  body: string;

  @Column({ type: DataType.STRING })
  title: string;

  @Column({ type: DataType.BOOLEAN })
  modarate: boolean;
}
