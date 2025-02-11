import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    HttpStatus,
    HttpCode,
    UseInterceptors,
    UploadedFile,
    Query,
    Req,
} from '@nestjs/common';
import { CreateVideoDto } from 'src/videos/dto/create-video.dto';
import { UpdateVideoDto } from 'src/videos/dto/update-video.dto';
import { AtJwtGuard } from 'src/auth/guards';
import { Permission } from '../common/decorators/permission.decorator';
import { RoleGuard } from 'src/common/guards';
import { UserRole } from 'src/user/user.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from 'src/videos/video.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Express, Request } from 'express';
import { ResponseMessage } from 'src/common/decorators/message.decorator';

@Controller('videos')
export class VideoController {
    constructor(private readonly videoService: VideoService) {}

    @Post()
    @Permission(UserRole.CHANNEL)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileInterceptor('video'))
    @HttpCode(HttpStatus.CREATED)
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createVideoDto: CreateVideoDto,
    ) {
        return await this.videoService.create(file, createVideoDto);
    }

    @Get('/channel/owner')
    @Permission(UserRole.CHANNEL)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get videos successfully')
    async findByChannelForOwner(@Req() request: Request) {
        return await this.videoService.findByChannelForOwner(request);
    }

    @Get('/channel/:uniqueName')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get channel videos successfully')
    async findByChannel(@Req() request: Request, @Param('uniqueName') uniqueName: string) {
        return await this.videoService.findByChannel(request, uniqueName);
    }

    @Get('/category/:category')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get category videos successfully')
    async findByCategory(
        @Param('category') category: string,
        @Query() paginationDto: PaginationDto,
    ) {
        return await this.videoService.findByCategory(category, paginationDto);
    }

    @Post(':videoId/view')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Increase video view successfully')
    async increaseView(@Param('videoId') videoId: string, @Req() request: Request) {
        return await this.videoService.increaseView(videoId, request);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findByVideoId(@Param('id') id: string) {
        return await this.videoService.findByVideoId(id);
    }

    @Patch(':id')
    @Permission(UserRole.CHANNEL)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
        return await this.videoService.update(id, updateVideoDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string) {
        return await this.videoService.remove(id);
    }
}
