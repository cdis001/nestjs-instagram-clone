import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/user.entity';
import { Comment } from './comment.entity';
import { CommentsDTO } from './comments.dto';
import { Feed } from 'src/feeds/feed.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Feed)
    private feedRepository: Repository<Feed>,
  ) {}

  async findAll() {
    const data = await this.commentRepository.find({
      relations: ['user', 'feed'],
    });
    return data;
  }

  findById(id: string): Promise<Comment> {
    return this.commentRepository.findOne({ id });
  }

  async create(comment: CommentsDTO) {
    const user = await this.userRepository.findOne({ id: comment.userId });
    const feed = await this.feedRepository.findOne({ id: comment.feedId });
    const data = await this.commentRepository.create(comment);
    data.user = user;
    data.feed = feed;

    return await this.commentRepository.save(data);
  }

  async update(id: string, comment: CommentsDTO) {
    await this.commentRepository.update({ id }, comment);
    return comment;
  }

  async remove(id: string) {
    await this.commentRepository.delete(id);
  }
}
