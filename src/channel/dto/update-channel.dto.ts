import { PartialType } from '@nestjs/mapped-types';
import { CreateChannelDto } from './create-channel.dto';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
    @IsOptional()
    @IsUrl()
    banner?: string;

    @IsOptional()
    @IsString()
    status?: string;
}
