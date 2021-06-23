import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
    ) {}
  
    findAll(): Promise<User[]> {
      return this.usersRepository.find();
    }
  
    findOne(id: string): Promise<User> {
      return this.usersRepository.findOne(id);
    }
  
    findByAccountName(accountName: string): Promise<User> {
        return this.usersRepository.findOne(accountName);
    }

    async remove(id: string): Promise<void> {
      await this.usersRepository.delete(id);
    }

    async create(user: User): Promise<User> {
        await this.usersRepository.save(user);
        return user;
      }
  }
