import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FilesInterceptor('file', null, multerOptions))
  create(
    @Body() profile: ProfilesDTO,
    @UploadedFiles() photo: Express.Multer.File,
  ) {
    if(photo !== undefined || null) {
      const uploadedFile: string[] = this.filesService.uploadFile(photo);
      profile.photo = uploadedFile;
    }

    return this.profilesService.create(profile);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get('user/:id')
  findByUserId(@Param('id') userId: string) {
    return this.profilesService.findByUserId(userId);
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
