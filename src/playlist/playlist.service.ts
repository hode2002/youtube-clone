import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist, PlaylistVisibility } from 'src/playlist/playlist.model';
import { Model, Types } from 'mongoose';
import { ModifyVideoDto } from 'src/playlist/dto';
import { Request } from 'express';
import { JwtPayload } from 'src/common/types';

@Injectable()
export class PlaylistService {
    constructor(
        @InjectModel(Playlist.name)
        private readonly playlistModel: Model<Playlist>,
    ) {}
    async create(req: Request, createPlaylistDto: CreatePlaylistDto) {
        const { userId } = req['user'] as JwtPayload;
        const { title, videoId, visibility = PlaylistVisibility.PRIVATE } = createPlaylistDto;
        return await this.playlistModel.create({
            title,
            owner: new Types.ObjectId(userId),
            visibility,
            videos: videoId ? [new Types.ObjectId(videoId)] : [],
        });
    }

    async findAll() {
        return await this.playlistModel
            .find()
            .populate({
                path: 'videos',
                model: 'Video',
            })
            .populate('owner')
            .exec();
    }

    async findAllByUserId(req: Request) {
        const { userId } = req['user'] as JwtPayload;
        return await this.playlistModel
            .find({ owner: new Types.ObjectId(userId) })
            .populate({
                path: 'videos',
                model: 'Video',
            })
            .populate('owner')
            .exec();
    }

    async findById(id: string) {
        return await this.playlistModel
            .findById(id)
            .populate({
                path: 'videos',
                model: 'Video',
            })
            .populate('owner')
            .exec();
    }

    async findByIdAndUpdate(id: string, updatePlaylistDto: UpdatePlaylistDto) {
        return await this.playlistModel
            .findByIdAndUpdate(id, updatePlaylistDto)
            .populate({
                path: 'videos',
                model: 'Video',
            })
            .populate('owner')
            .exec();
    }

    async addVideo(playlistId: string, modifyVideoDto: ModifyVideoDto) {
        const isExist = await this.playlistModel.exists({
            _id: playlistId,
            videos: new Types.ObjectId(modifyVideoDto.videoId),
        });
        if (isExist) throw new ConflictException('Video already exists in playlist');
        return await this.playlistModel
            .findByIdAndUpdate(
                playlistId,
                {
                    $push: { videos: new Types.ObjectId(modifyVideoDto.videoId) },
                },
                { new: true },
            )
            .populate({
                path: 'videos',
                model: 'Video',
            })
            .populate('owner')
            .exec();
    }

    async removeVideo(playlistId: string, modifyVideoDto: ModifyVideoDto) {
        const isExist = await this.playlistModel.exists({
            _id: playlistId,
            videos: new Types.ObjectId(modifyVideoDto.videoId),
        });
        if (!isExist) throw new ConflictException('Video not found');
        return await this.playlistModel
            .findByIdAndUpdate(
                playlistId,
                {
                    $pull: { videos: new Types.ObjectId(modifyVideoDto.videoId) },
                },
                { new: true },
            )
            .populate({
                path: 'videos',
                model: 'Video',
            })
            .populate('owner')
            .exec();
    }

    async remove(id: string) {
        return await this.playlistModel.findByIdAndDelete(id);
    }
}
