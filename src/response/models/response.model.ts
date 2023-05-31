import { ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/auth/auth.model';
import { Vacancy } from 'src/vacancy/models/vacancy.model';

@Table
export class ResponseModel extends Model {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @BelongsTo(() => User)
  autor: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  autorId: number;

  @ForeignKey(() => Vacancy)
  @Column({ type: DataType.INTEGER })
  vacancyId: number;

  @BelongsTo(() => Vacancy)
  vacancy: Vacancy;
}
