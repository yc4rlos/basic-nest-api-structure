import { HttpException, Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from './entities/attachment.entity';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { constants } from './constants/constants';

@Module({
  imports: [
    // Express Multer Config
    MulterModule.register({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          if (fs.existsSync('./uploads/')) {
            cb(null, './uploads/');
          } else {
            fs.mkdirSync('./uploads/');
          }
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`)
        }
      }),
      fileFilter: (req, file, cb) => {

        const acceptedTypes = constants.acceptedTypes;

        if (file.size > constants.maxFileSize) {
          cb(null, false);
        } else if (!acceptedTypes.includes(extname(file.originalname))) {
          cb(null, false);
        } else {
          cb(null, true);
        }
      }
    }),
    TypeOrmModule.forFeature([Attachment]),
  ],
  controllers: [AttachmentsController],
  providers: [AttachmentsService]
})
export class AttachmentsModule { }