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

@Controller('/api/v1/videos')
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

    @Get()
    findAll() {
        return this.videoService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findByVideoId(@Param('id') id: string) {
        return await this.videoService.findByVideoId(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
        return this.videoService.update(id, updateVideoDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.videoService.remove(+id);
    }
}
