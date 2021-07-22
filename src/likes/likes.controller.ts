import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LikesDTO } from './likes.dto';

import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  create(@Body() like: LikesDTO) {
    return this.likesService.create(like);
  }

  @Get()
  findAll() {
    return this.likesService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() like: LikesDTO) {
    return this.likesService.update(id, like);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.likesService.remove(id);
  }
}
