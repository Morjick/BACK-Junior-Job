import { User } from 'src/auth/auth.model';
import {
  Model,
  Table,
  Column,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class Message extends Model {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  type: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({ type: DataType.INTEGER, defaultValue: null })
  senderId: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  received: boolean;

  @Column({ type: DataType.STRING })
  body: string;
}