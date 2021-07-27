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

    return await this.profileRepository.save(data);
  }

  async findAll() {
    return await this.profileRepository.find();
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
