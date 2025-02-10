import {
    Controller,
    Get,
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
import { PlaylistService } from './playlist.service';
import { AtJwtGuard } from 'src/auth/guards';
import { ResponseMessage } from 'src/common/decorators/message.decorator';
import { ModifyVideoDto, CreatePlaylistDto, UpdatePlaylistDto } from 'src/playlist/dto';
import { Request } from 'express';

@Controller('playlist')
export class PlaylistController {
    constructor(private readonly playlistService: PlaylistService) {}

    @Post()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Create successfully')
    async create(@Req() req: Request, @Body() createPlaylistDto: CreatePlaylistDto) {
        return await this.playlistService.create(req, createPlaylistDto);
    }

    @Post(':playlistId/add-video')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Add video successfully')
    addVideo(@Param('playlistId') id: string, @Body() modifyVideoDto: ModifyVideoDto) {
        return this.playlistService.addVideo(id, modifyVideoDto);
    }

    @Get()
    findAll() {
        return this.playlistService.findAll();
    }

    @Get('me')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get playlist successfully')
    findAllByUserId(@Req() req: Request) {
        return this.playlistService.findAllByUserId(req);
    }

    @Get(':id')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Get playlist detail successfully')
    findById(@Param('id') id: string) {
        return this.playlistService.findById(id);
    }

    @Patch(':id')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Update playlist successfully')
    findByIdAndUpdate(@Param('id') id: string, @Body() updatePlaylistDto: UpdatePlaylistDto) {
        return this.playlistService.findByIdAndUpdate(id, updatePlaylistDto);
    }

    @Delete(':playlistId/remove-video')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Remove video successfully')
    removeVideo(@Param('playlistId') id: string, @Body() modifyVideoDto: ModifyVideoDto) {
        return this.playlistService.removeVideo(id, modifyVideoDto);
    }

    @Delete(':id')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Remove playlist successfully')
    remove(@Param('id') id: string) {
        return this.playlistService.remove(id);
    }
}
