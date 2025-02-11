import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLikeDislikeDto } from './dto/create-like-dislike.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LikeDislike } from 'src/like-dislike/like-dislike.model';
import { VideoService } from '../videos/video.service';
import { Request } from 'express';
import { JwtPayload } from 'src/common/types';
import { CommentService } from 'src/comment/comment.service';

export type UsersLiked = { userId: string; targetId: string; targetType: string };
export type LikeDislikeCount = { targetId: string; targetType: string };

@Injectable()
export class LikeDislikeService {
    constructor(
        @InjectModel(LikeDislike.name)
        private readonly likeDislikeModel: Model<LikeDislike>,
        private readonly videoService: VideoService,
        private readonly commentService: CommentService,
    ) {}
    private getModel(targetType: string): VideoService | CommentService {
        return targetType === 'video' ? this.videoService : this.commentService;
    }

    async like(request: Request, createLikeDislikeDto: CreateLikeDislikeDto) {
        const { userId } = request['user'] as JwtPayload;
        const { targetId, targetType } = createLikeDislikeDto;

        const existingLike = await this.likeDislikeModel.findOne({
            user: new Types.ObjectId(userId),
            target: new Types.ObjectId(targetId),
            targetType,
            type: 'like',
        });
        if (existingLike) return existingLike;

        const [result] = await Promise.all([
            this.likeDislikeModel.findOneAndUpdate(
                {
                    user: new Types.ObjectId(userId),
                    target: new Types.ObjectId(targetId),
                    targetType,
                },
                { type: 'like' },
                { upsert: true, new: true },
            ),
            this.getModel(targetType).increaseLike(targetId),
        ]);

        return result;
    }

    async removeLike(request: Request, createLikeDislikeDto: CreateLikeDislikeDto) {
        const { userId } = request['user'] as JwtPayload;
        const { targetId, targetType } = createLikeDislikeDto;

        const result = await this.likeDislikeModel.findOneAndDelete({
            user: new Types.ObjectId(userId),
            target: new Types.ObjectId(targetId),
            targetType,
            type: 'like',
        });

        if (!result) {
            throw new NotFoundException('Not found');
        }

        await this.getModel(targetType).decreaseLike(targetId);

        return result;
    }

    async dislike(request: Request, createLikeDislikeDto: CreateLikeDislikeDto) {
        const { userId } = request['user'] as JwtPayload;
        const { targetId, targetType } = createLikeDislikeDto;

        const existingDislike = await this.likeDislikeModel.findOne({
            user: new Types.ObjectId(userId),
            target: new Types.ObjectId(targetId),
            targetType,
            type: 'dislike',
        });
        if (existingDislike) return existingDislike;

        const [result] = await Promise.all([
            this.likeDislikeModel.findOneAndUpdate(
                {
                    user: new Types.ObjectId(userId),
                    target: new Types.ObjectId(targetId),
                    targetType,
                },
                { type: 'dislike' },
                { upsert: true, new: true },
            ),
            this.getModel(targetType).increaseDisLike(targetId),
        ]);

        return result;
    }

    async removeDislike(request: Request, createLikeDislikeDto: CreateLikeDislikeDto) {
        const { userId } = request['user'] as JwtPayload;
        const { targetId, targetType } = createLikeDislikeDto;

        const result = await this.likeDislikeModel.findOneAndDelete({
            user: new Types.ObjectId(userId),
            target: new Types.ObjectId(targetId),
            targetType,
            type: 'dislike',
        });

        if (!result) {
            throw new NotFoundException('Not found');
        }
        await this.getModel(targetType).decreaseLike(targetId);

        return result;
    }

    async usersLiked({ userId, targetId, targetType }: UsersLiked) {
        return await this.likeDislikeModel.findOne({
            user: new Types.ObjectId(userId),
            target: new Types.ObjectId(targetId),
            targetType,
        });
    }

    async likeDislikeCount({ targetId, targetType }: LikeDislikeCount) {
        const [likesCount, dislikesCount] = await Promise.all([
            this.likeDislikeModel.countDocuments({
                target: new Types.ObjectId(targetId),
                targetType,
                type: 'like',
            }),
            this.likeDislikeModel.countDocuments({
                target: new Types.ObjectId(targetId),
                targetType,
                type: 'dislike',
            }),
        ]);
        return { targetId, targetType, likesCount, dislikesCount };
    }
}
