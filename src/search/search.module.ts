import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ChannelModule } from 'src/channel/channel.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Search, SearchSchema } from 'src/search/search.model';
import { VideoModule } from 'src/videos/video.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Search.name, schema: SearchSchema }]),
        ChannelModule,
        VideoModule,
    ],
    controllers: [SearchController],
    providers: [SearchService],
    exports: [SearchService],
})
export class SearchModule {}
