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
        private feedRepository: Repository<Feed>,
        
        @InjectRepository(User)
        private userRepository: Repository<User>
        ) {}

    findAll(): Promise<Feed[]> {
        return this.feedRepository.find();
    }

    findById(id: string): Promise<Feed> {
        return this.feedRepository.findOne({id})
    }

    async findByUserId(userId: string) {
        const user = await this.userRepository.findOne({id: userId})
        const data = this.feedRepository.find({user})
        return data
    }

    async create(feed: FeedsDTO) {
        const user = await this.userRepository.findOne({id: feed.userId})
        const data = await this.feedRepository.create(feed)
        data.user = user;

        return await this.feedRepository.save(data)
    }

    async remove(id: string) {
      await this.feedRepository.delete(id);
    }

    async update(id: string, feed: Feed) {
        await this.feedRepository.update({id}, feed)
        return feed;
    }
}
