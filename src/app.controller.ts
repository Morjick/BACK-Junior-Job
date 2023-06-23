import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getDocumentation(@Res() res): string {
    return res
      .status(200)
      .json({
        pelmeniReceipt:
          'Обжариваем пелемени до корочки на большом огне. Добавляем соевый и другие любимые соусы, приправы. Также добавляем 100мл воды и закрываем крышкой на пару минут. Открвыем крышку, выпариваем воду до конца. Поздравляю, богические пельмени готовы!',
      })
      .redirect('/api');
  }
}
