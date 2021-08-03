import { Injectable } from '@nestjs/common';
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
        const follower = await this.userRepository.findOne({id: follow.followerId});
        const following = await this.userRepository.findOne({id: follow.followingId});
        const data = await this.followRepository.create(follow)

        data.follower = follower;
        data.following = following;

        return await this.followRepository.save(data);
    }

    async findAll() {
        const data = await this.followRepository.find({relations: ['follower', 'following'] });
        // const followerData = data.map((data) => {
        //     const {password, refreshToken, ...followerData} = data.follower

        //     return followerData;
        // })
        // const followData = data.map((data) => {
        //     const {password, refreshToken, ...followingData} = data.following

        //     return followingData
        // })
        // const result = data.map((data) => {
        //     const {id, checked} = data

        //     return 
        // })

        return data;
    }

    async update(id: string, follow: FollowsDTO) {
        const data = await this.followRepository.update({id}, follow)

        return data;
    }

    async remove(id: string) {
        const data = await this.followRepository.delete({id})

        return data;
    }
}
