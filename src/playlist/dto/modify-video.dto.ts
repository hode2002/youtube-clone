import { IsNotEmpty, IsString } from 'class-validator';

export class ModifyVideoDto {
    @IsString()
    @IsNotEmpty()
    videoId: string;
}
