import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from 'src/media/media.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { VideoModule } from 'src/videos/video.module';
import { PlaylistModule } from './playlist/playlist.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { LikeDislikeModule } from './like-dislike/like-dislike.module';
import { WatchHistoryModule } from './watch-history/watch-history.module';
import { CommentModule } from './comment/comment.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            expandVariables: true,
        }),
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get('MONGODB_URL'),
            }),
        }),
        VideoModule,
        UserModule,
        ChannelModule,
        MediaModule,
        CloudinaryModule,
        AuthModule,
        PlaylistModule,
        SubscriptionModule,
        LikeDislikeModule,
        WatchHistoryModule,
        CommentModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
