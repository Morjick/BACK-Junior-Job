import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Response,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StaticService } from './static.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import getTransplit from '../vendor/getTransplit';
import { join } from 'path';
import { ApiConsumes } from '@nestjs/swagger';

@Controller('static')
export class StaticController {
  constructor(private staticRepository: StaticService) {}

  @Get('image/:filename')
  async getImage(@Param() params, @Response() res) {
    return await this.staticRepository.getImage(params.filename, res);
  }

  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: function (req, file, cb) {
          cb(null, join(process.env.STATIC_PATH, '/images'));
        },
        filename: async function (req, file, cb) {
          const originalname = file.originalname
            .split('.')[0]
            .split(' ')
            .join('-');
          const transplitName = await getTransplit(originalname);
          const date = Date.now();
          const name = `${transplitName}-${date}.${
            file.originalname.split('.')[1]
          }`;

          file.originalname = name;
          cb(null, name);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'jpeg|png' })
        .addMaxSizeValidator({ maxSize: 2000000 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Response() res,
  ) {
    return await this.staticRepository.postImage(file, res);
  }
}
