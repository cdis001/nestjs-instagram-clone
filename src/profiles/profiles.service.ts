import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/user.entity';
import { Profile } from './profile.entity';
import { ProfilesDTO } from './profiles.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly filesService: FilesService,
  ) {}

  async create(profile: ProfilesDTO, photo: Express.Multer.File) {
    if (photo !== undefined || null) {
      const uploadedFile: string = this.filesService.uploadFile(photo);
      profile.photo = uploadedFile;
    }
    const user = await this.userRepository.findOne({ id: profile.userId });
    const data = await this.profileRepository.create(profile);
    data.user = user;

    await this.profileRepository.save(data);

    return profile;
  }

  async findAll() {
    const data = await this.profileRepository.find({ relations: ['user'] });
    const result = data.map((data) => {
      const { password, refreshToken, ...userData } = data.user;
      const { id, gender, birthday } = data;

      return { id, user: userData, gender, birthday };
    });
    return result;
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

  async update(profile: ProfilesDTO, photo: Express.Multer.File) {
    console.log(profile);

    const user = await this.userRepository.findOne({ id: profile.userId });
    const existingProfile = await this.profileRepository.findOne({ user });

    if (existingProfile) {
      await this.remove(profile.id);
    }

    const data = await this.create(profile, photo);

    return data;
  }

  async remove(id: string) {
    const existingProfile = await this.profileRepository.findOne({ id });
    await this.filesService.removeFile(existingProfile.photo);

    const data = await this.profileRepository.delete({ id });

    return id;
  }
}
