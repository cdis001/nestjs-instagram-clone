import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/user.entity';
import { Feed } from './feed.entity';
import { FeedsDTO } from './feeds.dto';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(Feed)
    private feedsRepository: Repository<Feed>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(feed: FeedsDTO) {
    const data = await this.feedsRepository.create(feed)
    // const user = await this.usersRepository.findOne({id: feed.userId})
    // console.log(user.accountName)
    // data.user = user;
    await this.feedsRepository.save(data);
    return data;
  }

  findAll() {
    return this.feedsRepository.find();
  }

  findById(id: number) {
    return `This action returns a #${id} feed`;
  }

  update(id: number, feed: Feed) {
    return `This action updates a #${id} feed`;
  }

  remove(id: number) {
    return `This action removes a #${id} feed`;
  }
}
