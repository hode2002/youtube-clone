import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateChannelDto {
    @IsString()
    @IsNotEmpty()
    uniqueName: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    owner: string;

    @IsUrl()
    avatarUrl: string;
}
