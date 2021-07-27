import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProfilesDTO } from './profiles.dto';

import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(@Body() profile: ProfilesDTO) {
    return this.profilesService.create(profile);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() profile: ProfilesDTO) {
    return this.profilesService.update(profile, id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(id);
  }
}
