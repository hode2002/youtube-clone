import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoSchema } from 'src/videos/video.model';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { VideoService } from 'src/videos/video.service';
import { ChannelModule } from 'src/channel/channel.module';
import { MediaModule } from 'src/media/media.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({}),
        MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
        ChannelModule,
        MediaModule,
        RedisModule,
    ],
    controllers: [VideoController],
    providers: [VideoService],
    exports: [VideoService],
})
export class VideoModule {}
