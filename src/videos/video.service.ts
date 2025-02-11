import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto, VideoPrivacy } from './dto/update-video.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Video, VideoStatus } from 'src/videos/video.model';
import { FilterQuery, Model, Types } from 'mongoose';
import { ChannelService } from '../channel/channel.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constant';
import { MediaService } from 'src/media/media.service';
import { Request } from 'express';
import { JwtPayload } from 'src/common/types';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class VideoService {
    constructor(
        @InjectModel(Video.name)
        private readonly videoModel: Model<Video>,
        private readonly channelService: ChannelService,
        private readonly mediaService: MediaService,
        private readonly redisService: RedisService,
    ) {}

    async create(file: Express.Multer.File, createVideoDto: CreateVideoDto) {
        if (!file) throw new BadRequestException('Missing video file');

        const channel = await this.channelService.findById(createVideoDto.channel);
        if (!channel) throw new ForbiddenException('You need to create a channel first');

        const video = await this.videoModel
            .findOne({ videoId: createVideoDto.videoId })
            .populate('channel')
            .exec();
        if (video) return video;

        const newVideo = await this.videoModel.create({
            ...createVideoDto,
            title: file.originalname.split('.')[0],
            channel: new Types.ObjectId(createVideoDto.channel),
        });

        return await newVideo.populate('channel');
    }

    async findByChannel(request: Request, uniqueName: string) {
        if (!uniqueName) throw new BadRequestException('Missing uniqueName');

        const channel = await this.channelService.findByUniqueName(uniqueName);
        if (!channel) throw new NotFoundException('Channel not found');

        return this.videoModel
            .find({
                channel: channel._id,
                status: VideoStatus.PUBLISHED,
                privacy: VideoPrivacy.PUBLIC,
            })
            .select('thumbnail url duration viewsCount title videoId createdAt status')
            .exec();
    }

    async findByChannelForOwner(request: Request) {
        const { userId } = request['user'] as JwtPayload;
        const channel = await this.channelService.findByOwnerId(userId);
        return this.videoModel
            .find({
                channel: channel._id,
            })
            .exec();
    }

    async findByCategory(category: string, paginationDto: PaginationDto) {
        if (!category) throw new BadRequestException('Missing category');
        const { skip = 0, limit = DEFAULT_PAGE_SIZE } = paginationDto;
        return await this.videoModel
            .find(
                { category, status: VideoStatus.PUBLISHED, privacy: VideoPrivacy.PUBLIC },
                {},
                { skip: +skip, limit: +limit },
            )
            .select('thumbnail url duration viewsCount title videoId channel createdAt')
            .populate('channel')
            .exec();
    }

    async findByVideoId(id: string) {
        if (!id) throw new BadRequestException('Missing video id');
        return await this.videoModel.findOne({ videoId: id }).populate('channel').exec();
    }

    async update(id: string, updateVideoDto: UpdateVideoDto) {
        const video = await this.videoModel.findById(id);
        if (!video) throw new BadRequestException('Video not found');
        return await this.videoModel.findByIdAndUpdate(
            id,
            {
                ...updateVideoDto,
                status: VideoStatus.PUBLISHED,
                publishedAt: new Date().toISOString(),
            },
            { new: true },
        );
    }

    async filter(filter: FilterQuery<Video>) {
        return await this.videoModel
            .find({ ...filter, status: VideoStatus.PUBLISHED, privacy: VideoPrivacy.PUBLIC })
            .select('title videoId description url thumbnail duration viewsCount createdAt channel')
            .populate('channel', 'name avatar subscribersCount');
    }

    async increaseView(videoId: string, request: Request) {
        const video = await this.videoModel.findById(videoId);
        if (!video) throw new NotFoundException('Video not found');

        const ip = request.ip;
        const viewKey = `view:${videoId}:${ip}`;
        const exists = await this.redisService.get(viewKey);

        if (!exists) {
            await Promise.all([
                this.videoModel.updateOne({ _id: videoId }, { $inc: { viewsCount: 1 } }),
                this.redisService.set(viewKey, '1', 10 * 1000),
            ]);
        }

        return { success: true };
    }

    async increaseCommentsCount(videoId: string) {
        await this.videoModel.findByIdAndUpdate(videoId, {
            $inc: { commentsCount: 1 },
        });
    }

    async decreaseCommentsCount(videoId: string) {
        await this.videoModel.findByIdAndUpdate(videoId, {
            $inc: { commentsCount: -1 },
        });
    }

    async increaseLike(videoId: string) {
        await this.videoModel.findByIdAndUpdate(videoId, {
            $inc: { likesCount: 1 },
        });
    }

    async decreaseLike(videoId: string) {
        await this.videoModel.findByIdAndUpdate(videoId, {
            $inc: { likesCount: -1 },
        });
    }

    async increaseDisLike(videoId: string) {
        await this.videoModel.findByIdAndUpdate(videoId, {
            $inc: { dislikesCount: 1 },
        });
    }

    async decreaseDisLike(videoId: string) {
        await this.videoModel.findByIdAndUpdate(videoId, {
            $inc: { dislikesCount: -1 },
        });
    }

    async remove(id: string) {
        const video = await this.videoModel.findById(id);
        if (!video) throw new BadRequestException('Video not found');
        return await Promise.all([
            this.mediaService.delete(video.url),
            this.videoModel.deleteOne({ _id: id }),
        ]);
    }
}
