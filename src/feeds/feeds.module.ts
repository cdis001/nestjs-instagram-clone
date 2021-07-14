import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Feed } from './feed.entity';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, User])],
  controllers: [FeedsController],
  providers: [FeedsService],
  exports: [TypeOrmModule],
})
export class FeedsModule {}
