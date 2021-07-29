import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Module({
  imports: [MulterModule.registerAsync({
    imports: [],
    useFactory: async () => ({
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(null, "uploads/")
        },
        filename: (req, file, cb) => {
          cb(null, `${uuid()}${file.originalname}`)
        }
      }),
    })
  })],
  providers: [FilesService],
  controllers: [FilesController]
})
export class FilesModule {}