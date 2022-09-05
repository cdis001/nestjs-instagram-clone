import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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

  async findAll(index: number, take: number = 10) {
    const data = await this.commentRepository.find({
      relations: ['user', 'feed', 'likes'],
      skip: index,
      take,
    });

    const result = data.map((data) => {
      const { id, user, feed, contents, createdAt, updatedAt } = data;
      const { password, refreshToken, ...userData } = user;
      // const {...feedData} = feed

      return { id, user: userData, feed, contents, createdAt, updatedAt };
    });
    return result;
  }

  async findByUserId(id: string, index: number, take: number = 10) {
    const user = await this.userRepository.findOne({ id });
    const data = await this.commentRepository.find({
      where: { user },
      relations: ['user', 'feed', 'likes'],
      skip: index,
      take,
    });

    const result = data.map((data) => {
      const { id, user, feed, contents, createdAt, updatedAt } = data;
      const { password, refreshToken, ...userData } = user;
      // const {...feedData} = feed

      return { id, user: userData, feed, contents, createdAt, updatedAt };
    });

    return result;
  }

  async findByFeedId(id: string, index: number, take: number = 10) {
    const feed = await this.feedRepository.findOne({ id });
    const data = await this.commentRepository.find({
      where: { feed },
      relations: ['user', 'feed', 'likes'],
      skip: index,
      take,
    });

    const result = data.map((data) => {
      const { id, user, feed, contents, createdAt, updatedAt } = data;
      const { password, refreshToken, ...userData } = user;
      // const {...feedData} = feed

      return { id, user: userData, feed, contents, createdAt, updatedAt };
    });

    return result;
  }

  async findById(id: string) {
    const data = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'feed', 'likes'],
    });
    const { user, feed, contents, createdAt, updatedAt } = data;
    const { password, refreshToken, ...userData } = user;

    return { id, user: userData, feed, contents, createdAt, updatedAt };
  }

  async create(comment: CommentsDTO) {
    const user = await this.userRepository.findOne({ id: comment.userId });
    const feed = await this.feedRepository.findOne({ id: comment.feedId });
    const data = await this.commentRepository.create(comment);
    data.user = user;
    data.feed = feed;
    data.likes = [];

    return await this.commentRepository.save(data);
  }

  async update(id: string, comment: CommentsDTO, userId: string) {
    const data = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (data.user.id !== userId) {
      throw new HttpException(
        '작성자만 수정할 수 있습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.commentRepository.update({ id }, comment);
    return comment;
  }

  async remove(id: string, userId: string) {
    const data = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (data.user.id != userId) {
      throw new HttpException(
        '작성자만 삭제할 수 있습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.commentRepository.delete(id);
  }
}
