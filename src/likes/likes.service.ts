import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Like } from './like.entity';
import { Comment } from 'src/comments/comment.entity';
import { User } from 'src/users/user.entity';
import { Feed } from 'src/feeds/feed.entity';
import { LikesDTO } from './likes.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Feed)
    private feedRepository: Repository<Feed>,

    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(like: LikesDTO) {
    const newLike = await this.likeRepository.create(like);

    const user = await this.userRepository.findOne({ id: like.userId });
    newLike.user = user;

    let data;
    if (like.feedId !== (null || undefined)) {
      data = await this.feedRepository.findOne({ id: like.feedId });
      newLike.feed = data;
    } else if (like.commentId !== (null || undefined)) {
      data = await this.commentRepository.findOne({ id: like.commentId });
      newLike.comment = data;
    } else {
      throw new HttpException(
        '좋아요를 표시할 댓글 또는 피드가 유효하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.likeRepository.save(newLike);;
  }

  async findAll() {
    const data = await this.likeRepository.find({
      relations: ['user', 'feed', 'comment'],
    });

    return data;
  }

  async update(id: string, like: LikesDTO) {
    return await this.likeRepository.update({ id }, like);
  }

  async remove(id: string) {
    return await this.likeRepository.delete(id);
  }
}
