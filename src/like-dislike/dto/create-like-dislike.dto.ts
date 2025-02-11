import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLikeDislikeDto {
    @IsString()
    @IsNotEmpty()
    targetType: string;

    @IsString()
    @IsNotEmpty()
    targetId: string;
}
