import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model, Types } from 'mongoose';
import { JwtPayload } from 'src/common/types';
import { CreateWatchHistoryDto } from 'src/watch-history/dto/create-watch-history.dto';
import { WatchHistory } from 'src/watch-history/watch-history.model';

@Injectable()
export class WatchHistoryService {
    constructor(
        @InjectModel(WatchHistory.name)
        private readonly watchHistoryModel: Model<WatchHistory>,
    ) {}
    async create(request: Request, createWatchHistoryDto: CreateWatchHistoryDto) {
        const { userId } = request['user'] as JwtPayload;
        const { videoId, progress, duration } = createWatchHistoryDto;

        return this.watchHistoryModel.findOneAndUpdate(
            { user: new Types.ObjectId(userId), video: new Types.ObjectId(videoId) },
            {
                watchedAt: new Date().toISOString(),
                progress,
                duration,
                completed: progress >= duration,
            },
            { upsert: true, new: true },
        );
    }

    async getUserWatchHistory(request: Request) {
        const { userId } = request['user'] as JwtPayload;
        return this.watchHistoryModel
            .find({ user: new Types.ObjectId(userId) })
            .sort({ watchedAt: -1 })
            .populate({
                path: 'video',
                select: 'title description thumbnail duration url viewsCount channel',
                populate: {
                    path: 'channel',
                    select: 'uniqueName name',
                },
            })
            .exec();
    }

    async remove(request: Request, id: string) {
        const { userId } = request['user'] as JwtPayload;
        return this.watchHistoryModel.findOneAndDelete({
            user: new Types.ObjectId(userId),
            _id: new Types.ObjectId(id),
        });
    }
}
