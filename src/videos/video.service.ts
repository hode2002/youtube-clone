import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Video } from 'src/videos/video.model';
import { Model } from 'mongoose';
import { ChannelService } from '../channel/channel.service';

@Injectable()
export class VideoService {
    constructor(
        @InjectModel(Video.name)
        private readonly videoModel: Model<Video>,
        private readonly channelService: ChannelService,
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

    findAll() {
        return `This action returns all videos`;
    }

    async findByVideoId(id: string) {
        return await this.videoModel.findOne({ videoId: id }).populate('channel').exec();
    }

    async update(id: string, updateVideoDto: UpdateVideoDto) {
        return `This action updates a #${id} video`;
    }

    remove(id: number) {
        return `This action removes a #${id} video`;
    }
}
