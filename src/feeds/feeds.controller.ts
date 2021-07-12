import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FeedsService } from './feeds.service';
import { Feed } from './feed.entity';
import { FeedsDTO } from './feeds.dto';

@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() feed: FeedsDTO, @UploadedFile() files: Express.Multer.File) {
    console.log(feed)
    console.log(files)
    const uploadedFiles: string[] = this.feedsService.uploadFiles(files);
    feed.files = uploadedFiles;
    return this.feedsService.create(feed);
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
  findByUserId(@Param('id') userId: string) {
    return this.feedsService.findByUserId(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() feed: Feed) {
    return this.feedsService.update(id, feed);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedsService.remove(id);
  }
}
