import { IsOptional, IsString } from 'class-validator';

export class UpdateSubscriptionDto {
    @IsString()
    @IsOptional()
    notificationType?: string;
}
