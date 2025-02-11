import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWatchHistoryDto {
    @IsNotEmpty()
    @IsString()
    videoId: string;

    @IsNotEmpty()
    @IsNumber()
    progress: number;

    @IsNotEmpty()
    @IsNumber()
    duration: number;
}
