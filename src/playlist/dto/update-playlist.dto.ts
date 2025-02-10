import { IsOptional, IsString } from 'class-validator';

export class UpdatePlaylistDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    visibility?: string;
}
