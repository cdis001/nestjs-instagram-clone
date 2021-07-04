import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { FeedsService } from './feeds.service';
import { Feed } from './feed.entity';

@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Post()
  create(@Body() feed: Feed) {
    return this.feedsService.create(feed);
  }

  @Get()
  findAll() {
    return this.feedsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() feed: Feed) {
    return this.feedsService.update(+id, feed);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedsService.remove(+id);
  }
}
