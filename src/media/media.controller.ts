import {
    Controller,
    HttpStatus,
    HttpCode,
    Post,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
    Body,
    Delete,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { SuccessResponse } from 'src/common/response';
import { AtJwtGuard } from 'src/auth/guards';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Post('upload/video')
    @UseGuards(AtJwtGuard)
    @UseInterceptors(FileInterceptor('video'))
    @HttpCode(HttpStatus.OK)
    async uploadVideo(
        @UploadedFile() file: Express.Multer.File,
        @Body('folder') folder?: string,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Upload success',
            data: await this.mediaService.upload(file, folder, 'video'),
        };
    }

    @Post('uploads/video')
    @UseGuards(AtJwtGuard)
    @UseInterceptors(FilesInterceptor('videos'))
    @HttpCode(HttpStatus.OK)
    async uploadMultipleVideo(
        @UploadedFiles() files: Express.Multer.File[],
        @Body('folder') folder?: string,
    ): Promise<SuccessResponse> {
        const results = [];
        for (const file of files) {
            const res = await this.mediaService.upload(file, folder, 'video');
            results.push({
                is_success: res?.public_id ? true : false,
                key: res.url,
            });
        }
        return {
            statusCode: HttpStatus.OK,
            message: 'Upload multiple success',
            data: results,
        };
    }

    @Post('upload')
    @UseGuards(AtJwtGuard)
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HttpStatus.OK)
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body('folder') folder?: string,
    ): Promise<SuccessResponse> {
        const result = await this.mediaService.upload(file, folder);
        return {
            statusCode: HttpStatus.OK,
            message: 'Upload success',
            data: {
                is_success: result?.public_id ? true : false,
                key: result.url,
            },
        };
    }

    @Post('uploads')
    @UseGuards(AtJwtGuard)
    @UseInterceptors(FilesInterceptor('images'))
    @HttpCode(HttpStatus.OK)
    async uploadMultiple(
        @UploadedFiles() files: Express.Multer.File[],
        @Body('folder') folder?: string,
    ): Promise<SuccessResponse> {
        const results = [];
        for (const file of files) {
            const res = await this.mediaService.upload(file, folder);
            results.push({
                is_success: res?.public_id ? true : false,
                key: res.url,
            });
        }
        return {
            statusCode: HttpStatus.OK,
            message: 'Upload multiple success',
            data: results,
        };
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    async remove(@Body('filePath') filePath: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Delete file success',
            data: await this.mediaService.delete(filePath),
        };
    }
}
