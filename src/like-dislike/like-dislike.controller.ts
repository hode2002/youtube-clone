import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { LikeDislikeService } from './like-dislike.service';
import { CreateLikeDislikeDto } from './dto/create-like-dislike.dto';
import { AtJwtGuard } from 'src/auth/guards';
import { ResponseMessage } from 'src/common/decorators/message.decorator';
import { Request } from 'express';

@Controller('like-dislike')
export class LikeDislikeController {
    constructor(private readonly likeDislikeService: LikeDislikeService) {}

    @Post('like')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Action successfully')
    async like(@Req() request: Request, @Body() createLikeDislikeDto: CreateLikeDislikeDto) {
        return await this.likeDislikeService.like(request, createLikeDislikeDto);
    }

    @Post('remove-like')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Action successfully')
    async removeLike(@Req() request: Request, @Body() createLikeDislikeDto: CreateLikeDislikeDto) {
        return await this.likeDislikeService.removeLike(request, createLikeDislikeDto);
    }

    @Post('dislike')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Action successfully')
    async dislike(@Req() request: Request, @Body() createLikeDislikeDto: CreateLikeDislikeDto) {
        return await this.likeDislikeService.dislike(request, createLikeDislikeDto);
    }

    @Post('remove-dislike')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Action successfully')
    async removeDislike(
        @Req() request: Request,
        @Body() createLikeDislikeDto: CreateLikeDislikeDto,
    ) {
        return await this.likeDislikeService.removeDislike(request, createLikeDislikeDto);
    }
}
