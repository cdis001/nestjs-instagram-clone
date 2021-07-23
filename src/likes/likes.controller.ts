import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LikesDTO } from './likes.dto';

import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  create(@Body() like: LikesDTO) {
    return this.likesService.create(like);
  }

  @Get()
  findAll() {
    return this.likesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.likesService.findById(id);
  }

  @Get('comment/:id')
  findByCommentId(@Param('id') id: string) {
    return this.likesService.findByCommentId(id);
  }

  @Get('feed/:id')
  findByFeedId(@Param('id') id: string) {
    return this.likesService.findByFeedId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() like: LikesDTO) {
    return this.likesService.update(id, like);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Body('userId') userId: string) {
    return this.likesService.remove(id, userId);
  }
}
