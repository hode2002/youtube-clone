import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Search } from 'src/search/search.model';
import { VideoService } from 'src/videos/video.service';
import { ChannelService } from 'src/channel/channel.service';

@Injectable()
export class SearchService {
    constructor(
        @InjectModel(Search.name)
        private readonly searchModel: Model<Search>,
        private readonly videoService: VideoService,
        private readonly channelService: ChannelService,
    ) {}
    async search(query: string) {
        if (!query) throw new BadRequestException('Missing query parameter');

        const queryRegex = new RegExp(query, 'i');

        const videos = await this.videoService.filter({
            $or: [{ title: queryRegex }, { description: queryRegex }],
        });

        const channels = await this.channelService.filter({
            $or: [{ name: queryRegex }, { uniqueName: queryRegex }],
        });

        return { videos, channels };
    }
}
