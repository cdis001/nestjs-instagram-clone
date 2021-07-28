import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/user.entity';
import { Profile } from './profile.entity';
import { ProfilesDTO } from './profiles.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(profile: ProfilesDTO) {
    const user = await this.userRepository.findOne({ id: profile.userId });
    const data = await this.profileRepository.create(profile);
    data.user = user;
    
    await this.profileRepository.save(data);

    return profile;
  }

  async findAll() {
    return await this.profileRepository.find();
  }

  async findByUserId(userId: string) {
    const user = await this.userRepository.findOne({ id: userId });
    const data = await this.profileRepository.findOne({
      where: { user },
      relations: ['user'],
    });

    const { password, refreshToken, ...userData } = data.user;
    const { id, gender, birthday } = data;

    return { id, user: userData, gender, birthday };
  }

  async update(profile: ProfilesDTO, id: string) {
    console.log(profile);
    const data = await this.profileRepository.update({ id }, profile);

    return data;
  }

  async remove(id: string) {
    const data = await this.profileRepository.delete({ id });

    return id;
  }
}
