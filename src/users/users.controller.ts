import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from './user.entity';

import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  updateUserInfo(@Body() userInfo: User) {
    return this.usersService.updateUserInfo(userInfo);
  }
}
