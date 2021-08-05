import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    const users = this.usersRepository.find();
    return users;
  }

  findById(id: string): Promise<User> {
    const user = this.usersRepository.findOne({ id });

    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  findByAccountName(accountName: string): Promise<User> {
    const user = this.usersRepository.findOne({ accountName });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(user: User): Promise<User> {
    await this.usersRepository.save(user);
    return user;
  }

  async setCurrentRefreshToken(refreshToken: string, id: string) {
    const currentHashedRefreshToken = await hash(refreshToken, 10);
    await this.usersRepository.update(id, {
      refreshToken: currentHashedRefreshToken,
    });
  }

  async removeRefreshToken(id: string) {
    await this.usersRepository.update(id, { refreshToken: null });
  }
}
