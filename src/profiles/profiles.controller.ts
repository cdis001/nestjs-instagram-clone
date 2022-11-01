import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilesDTO } from './profiles.dto';

import { ProfilesService } from './profiles.service';
import { multerOptions } from 'src/files/multerOption';
import { FilesService } from 'src/files/files.service';

@Controller('api/profiles')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly filesService: FilesService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  create(
    @Body() profile: ProfilesDTO,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.profilesService.create(profile, photo);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get('user/:id')
  findByUserId(@Param('id') userId: string) {
    return this.profilesService.findByUserId(userId);
  }

  @Patch()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  update(
    @Body() profile: ProfilesDTO,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.profilesService.update(profile, photo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(id);
  }

  @Delete('user/:id')
  removeByUserId(@Param('id') id: string) {
    return this.profilesService.removeByUserId(id);
  }
}
