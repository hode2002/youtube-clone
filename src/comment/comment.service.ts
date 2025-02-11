import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model, RootFilterQuery, Types } from 'mongoose';
import { Comment } from 'src/comment/comment.model';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/comment/dto/update-comment.dto';
import { JwtPayload } from 'src/common/types';
import { VideoService } from 'src/videos/video.service';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name)
        private readonly commentModel: Model<Comment>,
        private readonly videoService: VideoService,
    ) {}

    async create(request: Request, createCommentDto: CreateCommentDto) {
        const { userId } = request['user'] as JwtPayload;
        const { videoId } = createCommentDto;

        const userObjectId = new Types.ObjectId(userId);
        const videoObjectId = new Types.ObjectId(videoId);

        const result = this.commentModel.create({
            user: userObjectId,
            video: videoObjectId,
            ...createCommentDto,
        });

        if (!result) throw new UnprocessableEntityException('Unable to create reply comment');

        await this.videoService.increaseCommentsCount(videoId);

        return result;
    }

    async createReply(request: Request, createCommentDto: CreateCommentDto) {
        const { userId } = request['user'] as JwtPayload;
        const { videoId, parentId } = createCommentDto;

        const userObjectId = new Types.ObjectId(userId);
        const videoObjectId = new Types.ObjectId(videoId);
        const parentObjectId = parentId ? new Types.ObjectId(parentId) : null;

        const result = await this.commentModel.create({
            user: userObjectId,
            video: videoObjectId,
            parent: parentObjectId,
            ...createCommentDto,
        });

        if (!result) throw new UnprocessableEntityException('Unable to create reply comment');

        await Promise.all([
            this.increaseRepliesCount({ _id: parentObjectId }),
            this.videoService.increaseCommentsCount(videoId),
        ]);

        return result;
    }

    private async increaseRepliesCount(filter: RootFilterQuery<Comment>) {
        await this.commentModel.findOneAndUpdate(filter, {
            $inc: { repliesCount: 1 },
        });
    }

    async getVideoComments(videoId: string) {
        return this.commentModel
            .find({ video: new Types.ObjectId(videoId), parent: null })
            .sort({ createdAt: -1 })
            .populate('user', 'username avatar');
    }

    async getCommentReplies(commentId: string) {
        return this.commentModel
            .find({ parent: new Types.ObjectId(commentId) })
            .sort({ createdAt: 1 })
            .populate('user', 'username avatar');
    }

    async update(request: Request, commentId: string, updateCommentDto: UpdateCommentDto) {
        const { userId } = request['user'] as JwtPayload;
        return this.commentModel
            .findOneAndUpdate(
                { _id: new Types.ObjectId(commentId), user: new Types.ObjectId(userId) },
                { ...updateCommentDto },
                { new: true },
            )
            .populate('user', 'username avatar');
    }

    async increaseLike(videoId: string) {
        await this.commentModel.findByIdAndUpdate(videoId, {
            $inc: { likesCount: 1 },
        });
    }

    async decreaseLike(videoId: string) {
        await this.commentModel.findByIdAndUpdate(videoId, {
            $inc: { likesCount: -1 },
        });
    }

    async increaseDisLike(videoId: string) {
        await this.commentModel.findByIdAndUpdate(videoId, {
            $inc: { dislikesCount: 1 },
        });
    }

    async decreaseDisLike(videoId: string) {
        await this.commentModel.findByIdAndUpdate(videoId, {
            $inc: { dislikesCount: -1 },
        });
    }
}
