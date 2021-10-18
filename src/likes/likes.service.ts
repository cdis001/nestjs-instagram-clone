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

    return await this.likeRepository.save(newLike);
  }

  async findAll() {
    const data = await this.likeRepository.find({
      relations: ['user', 'feed', 'comment'],
    });

    const result = data.map((data) => {
      const { user, ...likeDatas } = data;
      const { password, refreshToken, ...userData } = user;

      return { ...likeDatas, user: userData };
    });

    return result;
  }

  async findById(id: string) {
    const data = await this.likeRepository.findOne({
      where: { id },
      relations: ['user', 'feed', 'comment'],
    });

    const { user, ...likeDatas } = data;
    const { password, refreshToken, ...userData } = user;

    return { ...likeDatas, user: userData };
  }

  async findByFeedId(id: string) {
    const feed = await this.feedRepository.findOne({ id });
    const data = await this.likeRepository.find({
      where: { feed },
      relations: ['feed', 'user'],
    });

    const result = data.map((data) => {
      const { user, ...likeDatas } = data;
      const { password, refreshToken, ...userData } = user;

      return { ...likeDatas, user: userData };
    });

    return result;
  }

  async findByCommentId(id: string) {
    const comment = await this.commentRepository.findOne({ id });
    const data = await this.likeRepository.find({
      where: { comment },
      relations: ['comment', 'user'],
    });

    const result = data.map((data) => {
      const { user, ...likeDatas } = data;
      const { password, refreshToken, ...userData } = user;

      return { ...likeDatas, user: userData };
    });

    return result;
  }

  async update(id: string, like: LikesDTO) {
    const data = await this.likeRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    const { userId, ...newLike } = like;

    if (data.user.id !== userId) {
      throw new HttpException(
        '작성자만 수정할 수 있습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.likeRepository.update({ id }, newLike);
  }

  async remove(id: string, userId: string) {
    const data = await this.likeRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (data.user.id !== userId) {
      throw new HttpException(
        '작성자만 수정할 수 있습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.likeRepository.delete(id);
  }
}
