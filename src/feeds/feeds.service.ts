import { Injectable, UploadedFiles } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/user.entity';
import { Feed } from './feed.entity';
import { FeedsDTO } from './feeds.dto';
import { createImageURL } from 'src/file/multerOption';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(Feed)
    private feedRepository: Repository<Feed>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    const data = await this.feedRepository.find({ relations: ['user'] });
    return data;
  }

  findById(id: string): Promise<Feed> {
    return this.feedRepository.findOne({ id });
  }

  async findByUserId(userId: string, index: number, take: number = 10) {
    const user = await this.userRepository.findOne({ id: userId });
    const data = this.feedRepository
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.user', 'user')
      .where({ user })
      .andWhere('user.id = :userId', { userId: user.id })
      .select(['user.id', 'user.accountName', 'user.userName', 'feed.*'])
      .take(take)
      .skip(index)
      .execute();

    return data;
  }

  uploadFiles(@UploadedFiles() files: Express.Multer.File): string[] {
    const generatedFiles: string[] = []
    generatedFiles.push(createImageURL(files));

    // for (const file of files) {
    //   generatedFiles.push(createImageURL(file));
    // }
    return generatedFiles;
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
