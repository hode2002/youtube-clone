import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
    Req,
    Patch,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AtJwtGuard } from 'src/auth/guards';
import { ResponseMessage } from 'src/common/decorators/message.decorator';
import { Request } from 'express';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Create successfully')
    async create(@Req() request: Request, @Body() createCommentDto: CreateCommentDto) {
        return this.commentService.create(request, createCommentDto);
    }

    @Post('reply')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Create reply successfully')
    async createReply(@Req() request: Request, @Body() createCommentDto: CreateCommentDto) {
        return this.commentService.createReply(request, createCommentDto);
    }

    @Get(':videoId')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get video comments successfully')
    async getVideoComments(@Param('videoId') videoId: string) {
        return this.commentService.getVideoComments(videoId);
    }

    @Get('replies/:commentId')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get comment replies successfully')
    async getCommentReplies(@Param('commentId') commentId: string) {
        return this.commentService.getCommentReplies(commentId);
    }

    @Patch(':commentId')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Update comment successfully')
    async update(
        @Req() request: Request,
        @Param('commentId') commentId: string,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        return this.commentService.update(request, commentId, updateCommentDto);
    }
}
