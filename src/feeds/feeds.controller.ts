import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

import { FeedsService } from './feeds.service';
import { Feed } from './feed.entity';
import { FeedsDTO } from './feeds.dto';
import { multerOptions } from 'src/files/multerOption';
import { FilesService } from 'src/files/files.service';

@Controller('api/feeds')
export class FeedsController {
  constructor(
    private readonly feedsService: FeedsService,
    private readonly filesService: FilesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('file', null, multerOptions))
  create(
    @Body() feed: FeedsDTO,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // console.log(feed);
    // console.log(files);
    const uploadedFiles: string[] = this.filesService.uploadFiles(files);
    try {
      feed.files = uploadedFiles;
      const newFeed = this.feedsService.create(feed);

      return newFeed;
    } catch (error) {
      for (const file of uploadedFiles) {
        this.filesService.removeFile(file);
      }
    }
  }

  @Get()
  findAll() {
    return this.feedsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.feedsService.findById(id);
  }

  @Get('user/:id')
  findByUserId(@Param('id') userId: string, @Body() data: any) {
    const { index } = data;
    return this.feedsService.findByUserId(userId, index);
  }

  @Post('userFeeds')
  findByUserIds(@Body('ids') ids: Array<string>, @Body('index') index: number) {
    return this.feedsService.findByUserIds(ids, index);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() feed: Feed) {
    console.log(id);
    return this.feedsService.update(id, feed);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedsService.remove(id);
  }
}
