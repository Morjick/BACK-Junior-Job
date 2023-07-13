import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './models/message.model';
import { GetMessageDto } from './dto/message.get-dto';

@Injectable()
export class MessageService {
    constructor (@InjectModel(Message) private messageRepository: typeof Message) {}

    async getMany(res: any, userId: number, param: GetMessageDto) {
        const messages = await this.messageRepository.findAll({where: {userId, ...param}})

        messages.forEach(async (message) => {
            await message.update({received: true})
        })

        return res.status(200).json({
            message: 'Сообщения найдены',
            ok: true,
            messages
        })
    }
}
