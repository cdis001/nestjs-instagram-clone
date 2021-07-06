import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeedsService } from './feeds.service';
import { FeedsController } from './feeds.controller';
import { Feed } from './feed.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, User])],
  controllers: [FeedsController],
  providers: [FeedsService],
})
export class FeedsModule {}
