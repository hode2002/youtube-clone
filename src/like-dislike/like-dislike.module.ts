import { Module } from '@nestjs/common';
import { LikeDislikeService } from './like-dislike.service';
import { LikeDislikeController } from './like-dislike.controller';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeDislike, LikeDislikeSchema } from 'src/like-dislike/like-dislike.model';
import { VideoModule } from 'src/videos/video.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: LikeDislike.name, schema: LikeDislikeSchema }]),
        UserModule,
        VideoModule,
        CommentModule,
    ],
    controllers: [LikeDislikeController],
    providers: [LikeDislikeService],
})
export class LikeDislikeModule {}
