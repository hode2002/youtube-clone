import {
    Controller,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    HttpCode,
    HttpStatus,
    Req,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { AtJwtGuard } from 'src/auth/guards';
import { ResponseMessage } from 'src/common/decorators/message.decorator';
import { Request } from 'express';

@Controller('subscriptions')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    @Post()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Subscribe successfully')
    async subscribe(@Req() req: Request, @Body() createSubscriptionDto: CreateSubscriptionDto) {
        return await this.subscriptionService.subscribe(req, createSubscriptionDto);
    }

    @Patch(':id')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Update notification type successfully')
    update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
        return this.subscriptionService.update(id, updateSubscriptionDto);
    }

    @Delete(':channelId')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Unsubscribe successfully')
    unsubscribe(@Req() req: Request, @Param('channelId') channelId: string) {
        return this.subscriptionService.unsubscribe(req, channelId);
    }
}
