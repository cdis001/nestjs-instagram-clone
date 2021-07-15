import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { CommentsService } from './comments.service';
import { CommentsDTO } from './comments.dto';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService){}

    @Post()
    create(@Body() comment: CommentsDTO ) {
        return this.commentsService.create(comment)
    }

    @Get()
    findAll() {
        return this.commentsService.findAll();
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() comments: CommentsDTO) {
        return this.commentsService.update(id, comments)
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.commentsService.remove(id)
    }
}
