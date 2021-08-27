import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FollowsDTO } from './follows.dto';
import { FollowsService } from './follows.service';

@Controller('api/follows')
export class FollowsController {
  constructor(private readonly followersSercive: FollowsService) {}

  @Post()
  create(@Body() follow: FollowsDTO) {
    return this.followersSercive.create(follow);
  }

  @Get()
  findAll() {
    return this.followersSercive.findAll();
  }

  @Get('follower/:id')
  findByFollowerId(@Param('id') id: string) {
    return this.followersSercive.findByFollowerId(id);
  }

  @Get('following/:id')
  findByFollowingId(@Param('id') id: string) {
    return this.followersSercive.findByFollowingId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() follow: FollowsDTO) {
    return this.followersSercive.update(id, follow);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followersSercive.remove(id);
  }
}
