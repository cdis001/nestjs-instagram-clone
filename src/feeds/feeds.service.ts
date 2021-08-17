import { Injectable, UploadedFiles } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/user.entity';
import { Feed } from './feed.entity';
import { FeedsDTO } from './feeds.dto';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(Feed)
    private feedRepository: Repository<Feed>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    const data = await this.feedRepository.find({ relations: ['user', 'like', 'comment'] });
    const result = data.map((data) => {
      const { user, ...feedData } = data;
      const { password, refreshToken, ...userData } = user;

      return { feed: feedData, user: userData };
    });

    return result;
  }

  async findById(id: string) {
    const data = await this.feedRepository.findOne({
      where: { id },
      relations: ['user', 'like', 'comment'],
    });
    const { user, ...feedData } = data;
    const { password, refreshToken, ...userData } = user;

    return { feed: feedData, user: userData };
  }

  async findByUserId(userId: string, index: number, take: number = 10) {
    const user = await this.userRepository.findOne({ id: userId });
    const data = await this.feedRepository.find({
      where: { user },
      skip: index,
      take,
      relations: ['user', 'like', 'comment'],
    });
    const result = data.map((data) => {
      const { user, ...feedData } = data;
      const { password, refreshToken, ...userData } = user;

      return { feed: feedData, user: userData };
    });

    return result;
  }

  async create(feed: FeedsDTO) {
    const user = await this.userRepository.findOne({ id: feed.userId });
    const data = await this.feedRepository.create(feed);
    data.user = user;

    return await this.feedRepository.save(data);
  }

  async remove(id: string) {
    await this.feedRepository.delete(id);
  }

  async update(id: string, feed: Feed) {
    await this.feedRepository.update({ id }, feed);
    return feed;
  }
}
