import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/user.entity';
import { Follow } from './follow.entity';
import { FollowsDTO } from './follows.dto';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(follow: FollowsDTO) {
    const follower = await this.userRepository.findOne({
      id: follow.followerId,
    });
    const following = await this.userRepository.findOne({
      id: follow.followingId,
    });
    let newFollow = await this.followRepository.findOne({
      follower,
      following,
    });

    if (newFollow) {
      throw new HttpException(
        '이미 팔로우 한 유저입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createData = await this.followRepository.create(follow);

    createData.follower = follower;
    createData.following = following;

    const data = await this.followRepository.save(createData);

    const followerData = {
      id: data.follower.id,
      phoneNumber: data.follower.phoneNumber,
      email: data.follower.email,
      userName: data.follower.userName,
      accountName: data.follower.accountName,
    };
    const followingData = {
      id: data.following.id,
      phoneNumber: data.following.phoneNumber,
      email: data.following.email,
      userName: data.following.userName,
      accountName: data.following.accountName,
    };
    const { id, checked, createdAt, updatedAt } = data;

    return {
      id,
      follower: followerData,
      following: followingData,
      checked,
      createdAt,
      updatedAt,
    };
  }

  async findAll() {
    const data = await this.followRepository.find({
      relations: ['follower', 'following'],
    });

    const result = data.map((data) => {
      const followerData = {
        id: data.follower.id,
        phoneNumber: data.follower.phoneNumber,
        email: data.follower.email,
        userName: data.follower.userName,
        accountName: data.follower.accountName,
      };
      const followingData = {
        id: data.following.id,
        phoneNumber: data.following.phoneNumber,
        email: data.following.email,
        userName: data.following.userName,
        accountName: data.following.accountName,
      };
      const { id, checked, createdAt, updatedAt } = data;

      return {
        id,
        follower: followerData,
        following: followingData,
        checked,
        createdAt,
        updatedAt,
      };
    });

    return result;
  }

  async findByFollowerId(id: string) {
    const follower = await this.userRepository.findOne({ id });
    const data = await this.followRepository.find({
      where: { follower },
      relations: ['follower', 'following'],
    });
    const result = data.map((data) => {
      const followerData = {
        id: data.follower.id,
        phoneNumber: data.follower.phoneNumber,
        email: data.follower.email,
        userName: data.follower.userName,
        accountName: data.follower.accountName,
      };
      const followingData = {
        id: data.following.id,
        phoneNumber: data.following.phoneNumber,
        email: data.following.email,
        userName: data.following.userName,
        accountName: data.following.accountName,
      };
      const { id, checked, createdAt, updatedAt } = data;

      return {
        id,
        follower: followerData,
        following: followingData,
        checked,
        createdAt,
        updatedAt,
      };
    });

    return result;
  }

  async findByFollowingId(id: string) {
    const following = await this.userRepository.findOne({ id });
    const data = await this.followRepository.find({
      where: { following },
      relations: ['follower', 'following'],
    });
    const result = data.map((data) => {
      const followerData = {
        id: data.follower.id,
        phoneNumber: data.follower.phoneNumber,
        email: data.follower.email,
        userName: data.follower.userName,
        accountName: data.follower.accountName,
      };
      const followingData = {
        id: data.following.id,
        phoneNumber: data.following.phoneNumber,
        email: data.following.email,
        userName: data.following.userName,
        accountName: data.following.accountName,
      };
      const { id, checked, createdAt, updatedAt } = data;

      return {
        id,
        follower: followerData,
        following: followingData,
        checked,
        createdAt,
        updatedAt,
      };
    });

    return result;
  }

  async update(id: string, follow: FollowsDTO) {
    const data = await this.followRepository.update({ id }, follow);

    return data;
  }

  async remove(follow: FollowsDTO) {
    const { followerId, followingId } = follow;
    try {
      const follower = await this.followRepository.findOne({
        where: { follower: followerId, following: followingId },
      });

      const result = await this.followRepository.delete({ id: follower.id });
      return { id: follower.id, followerId, followingId };
    } catch (error) {
      throw new HttpException('failed unfollow.', HttpStatus.BAD_REQUEST);
    }
  }
}
