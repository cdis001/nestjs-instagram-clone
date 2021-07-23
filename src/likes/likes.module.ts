import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Like } from './like.entity';
import { Comment } from 'src/comments/comment.entity';
import { Feed } from 'src/feeds/feed.entity';
import { User } from 'src/users/user.entity';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Feed, User, Comment])],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [TypeOrmModule],
})
export class LikesModule {}
