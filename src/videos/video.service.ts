import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Video, VideoStatus } from 'src/videos/video.model';
import { Model } from 'mongoose';
import { ChannelService } from '../channel/channel.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constant';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class VideoService {
    constructor(
        @InjectModel(Video.name)
        private readonly videoModel: Model<Video>,
        private readonly channelService: ChannelService,
        private readonly mediaService: MediaService,
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
            title: file.originalname.split('.')[0],
            ...createVideoDto,
        });

        return await newVideo.populate('channel');
    }

    async findByCategory(category: string, paginationDto: PaginationDto) {
        if (!category) throw new BadRequestException('Missing category');
        const { skip = 0, limit = DEFAULT_PAGE_SIZE } = paginationDto;
        return await this.videoModel
            .find({ category }, {}, { skip: +skip, limit: +limit })
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

    async increaseView(videoId: string) {
        return await this.videoModel.findByIdAndUpdate(videoId, {
            $inc: { viewsCount: -1 },
        });
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
