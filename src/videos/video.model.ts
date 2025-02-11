import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum VideoPrivacy {
    PUBLIC = 'public',
    PRIVATE = 'private',
    UNLISTED = 'unlisted',
}

export enum VideoStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    PROCESSING = 'processing',
}

export type VideoDocument = Video & Document;

@Schema({ timestamps: true })
export class Video {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    videoId: string;

    @Prop({ default: '' })
    description: string;

    @Prop({ required: true })
    url: string;

    @Prop({ default: '' })
    thumbnail: string;

    @Prop({ default: 0 })
    duration: number;

    @Prop({ default: 0 })
    viewsCount: number;

    @Prop({ default: 0 })
    likesCount: number;

    @Prop({ default: 0 })
    dislikesCount: number;

    @Prop({ default: 0 })
    commentsCount: number;

    @Prop({ enum: Object.values(VideoPrivacy), default: VideoPrivacy.PRIVATE })
    privacy: VideoPrivacy;

    @Prop({ enum: VideoStatus, default: VideoStatus.DRAFT })
    status: VideoStatus;

    @Prop({ default: '' })
    publishedAt: string;

    @Prop({ default: '' })
    category: string;

    @Prop({ type: Types.ObjectId, ref: 'Channel', required: true })
    channel: Types.ObjectId;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
