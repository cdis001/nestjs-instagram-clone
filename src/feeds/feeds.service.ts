import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/user.entity';
import { Feed } from './feed.entity';
import { FeedsDTO } from './feeds.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(Feed)
    private feedRepository: Repository<Feed>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly filesService: FilesService,
  ) {}

  async findAll() {
    const data = await this.feedRepository.find({
      relations: ['user', 'likes', 'comments'],
    });
    const result = data.map((data) => {
      const { user, ...feedData } = data;
      const { password, refreshToken, ...userData } = user;

      return { ...feedData, user: userData };
    });

    return result;
  }

  async findById(id: string) {
    const data = await this.feedRepository.findOne({
      where: { id },
      relations: ['user', 'likes', 'comments'],
    });
    const { user, ...feedData } = data;
    const { password, refreshToken, ...userData } = user;

    return { ...feedData, user: userData };
  }

  async findByUserId(userId: string, index: number, take: number = 10) {
    const user = await this.userRepository.findOne({ accountName: userId });
    const data = await this.feedRepository.find({
      where: { user },
      skip: index,
      take,
      relations: ['user', 'likes', 'comments'],
      order: {
        createdAt: 'DESC',
      },
    });
    const result = data.map((data) => {
      const { user, ...feedData } = data;
      const { password, refreshToken, ...userData } = user;

      return { ...feedData, user: userData };
    });

    return result;
  }

  async findByUserIds(ids: Array<string>, index: number, take: number = 10) {
    const jsonUserData = await (
      await this.userRepository.find({ where: [...ids] })
    ).map((data) => {
      return { user: data };
    });

    const data = await this.feedRepository.find({
      where: [...jsonUserData],
      skip: index,
      take,
      relations: ['user', 'likes', 'comments'],
      order: {
        createdAt: 'DESC',
      },
    });

    const result = data.map((data) => {
      const { user, ...feedData } = data;
      const { password, refreshToken, ...userData } = user;

      return { ...feedData, user: userData };
    });

    return result;
  }

  async create(feed: FeedsDTO) {
    if (feed.files.length < 1) {
      throw new HttpException('file is null', 401);
    }
    const user = await this.userRepository.findOne({ id: feed.userId });
    const data = await this.feedRepository.create(feed);
    data.user = user;
    data.likes = [];
    data.comments = [];

    const saveFeed = await this.feedRepository.save(data);
    const { password, refreshToken, ...userData } = saveFeed.user;

    return { ...saveFeed, user: userData };
  }

  async remove(id: string) {
    const data = await this.feedRepository.findOne({ id });

    try {
      const { files } = data;
      for (const file of files) {
        this.filesService.removeFile(file);
      }
      return await this.feedRepository.delete(id);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async update(id: string, feed: Feed) {
    await this.feedRepository.update({ id }, feed);
    return feed;
  }
}
