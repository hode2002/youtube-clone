import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoDto } from './create-video.dto';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

export enum VideoPrivacy {
    PUBLIC = 'public',
    PRIVATE = 'private',
    UNLISTED = 'unlisted',
}

export class UpdateVideoDto extends PartialType(CreateVideoDto) {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUrl()
    @IsOptional()
    thumbnail?: string;

    @IsEnum(VideoPrivacy)
    @IsOptional()
    privacy?: VideoPrivacy = VideoPrivacy.PUBLIC;
}
