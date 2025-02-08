import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateVideoDto {
    @IsString()
    @IsNotEmpty()
    channel: string;

    @IsString()
    @IsNotEmpty()
    videoId: string;

    @IsUrl()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsNotEmpty()
    category: string;
}
