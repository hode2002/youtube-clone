import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { AtJwtGuard } from 'src/auth/guards';
import { Request } from 'express';

@Controller('api/v1/channels')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {}

    @Post()
    @UseGuards(AtJwtGuard)
    async create(@Req() request: Request, @Body() createChannelDto: CreateChannelDto) {
        return await this.channelService.create(request, createChannelDto);
    }

    @Get()
    findAll() {
        return this.channelService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this.channelService.findById(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
        return this.channelService.update(+id, updateChannelDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.channelService.remove(+id);
    }
}
