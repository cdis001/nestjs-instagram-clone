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

  async findAll() {
    const users = await this.usersRepository.find();
    const result = users.map((data) => {
      const { password, refreshToken, ...userData } = data;

      return { user: userData };
    });
    return result;
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
      'User with this accountName does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  findByUserId(userId: string): Promise<User> {
    const user = this.usersRepository.findOne({
      where: [{ accountName: userId }, { email: userId }],
    });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this accountName does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  findByEmail(email: string): Promise<User> {
    const user = this.usersRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async remove(id: string) {
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
