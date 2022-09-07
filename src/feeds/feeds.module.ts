import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from '../comments/comment.entity';
import { Like } from '../likes/like.entity';
import { Feed } from './feed.entity';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';
import { User } from 'src/users/user.entity';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, User, Comment, Like])],
  controllers: [FeedsController],
  providers: [FeedsService, FilesService],
  exports: [TypeOrmModule],
})
export class FeedsModule {}
