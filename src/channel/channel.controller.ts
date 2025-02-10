import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    Req,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { AtJwtGuard } from 'src/auth/guards';
import { Request } from 'express';
import { ResponseMessage } from 'src/common/decorators/message.decorator';

@Controller('channels')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {}

    @Post()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage('Create successfully')
    async create(@Req() request: Request) {
        return await this.channelService.create(request);
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this.channelService.findById(id);
    }

    @Patch(':id')
    @UseGuards(AtJwtGuard)
    @ResponseMessage('Update successfully')
    update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
        return this.channelService.update(id, updateChannelDto);
    }
}
