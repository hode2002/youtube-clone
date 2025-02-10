import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePlaylistDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    videoId: string;

    @IsString()
    @IsOptional()
    visibility?: string;
}
