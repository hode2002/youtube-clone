import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    HttpCode,
    HttpStatus,
    Req,
} from '@nestjs/common';
import { WatchHistoryService } from './watch-history.service';
import { CreateWatchHistoryDto } from './dto/create-watch-history.dto';
import { AtJwtGuard } from 'src/auth/guards';
import { ResponseMessage } from 'src/common/decorators/message.decorator';
import { Request } from 'express';

@Controller('watch-history')
export class WatchHistoryController {
    constructor(private readonly watchHistoryService: WatchHistoryService) {}

    @Post()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Create successfully')
    async create(@Req() request: Request, @Body() createWatchHistoryDto: CreateWatchHistoryDto) {
        return await this.watchHistoryService.create(request, createWatchHistoryDto);
    }

    @Get()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get user watch history successfully')
    async getUserWatchHistory(@Req() request: Request) {
        return await this.watchHistoryService.getUserWatchHistory(request);
    }

    @Delete(':id')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Delete successfully')
    async remove(@Req() request: Request, @Param('id') id: string) {
        return await this.watchHistoryService.remove(request, id);
    }
}
