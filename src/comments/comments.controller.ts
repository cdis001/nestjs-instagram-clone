import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CommentsService } from './comments.service';
import { CommentsDTO } from './comments.dto';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService){}

    @Post()
    @UseGuards(AuthGuard("jwt"))
    create(@Body() comment: CommentsDTO ) {
        return this.commentsService.create(comment)
    }

    @Get()
    findAll() {
        return this.commentsService.findAll();
    }

    @Get(":id")
    findById(@Param('id') id: string) {
        return this.commentsService.findById(id);
    }

    @Get("user/:id")
    findByUserId(@Param('id') id: string) {
        return this.commentsService.findByUserId(id);
    }

    @Get("feed/:id")
    findByFeedId(@Param('id') id: string) {
        return this.commentsService.findByFeedId(id);
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
