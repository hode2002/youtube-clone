import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlaylistDocument = Playlist & Document;

export enum PlaylistVisibility {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

@Schema({ timestamps: true })
export class Playlist {
    @Prop({ required: true })
    title: string;

    @Prop({ default: '' })
    description: string;

    @Prop({ enum: PlaylistVisibility, default: PlaylistVisibility.PRIVATE })
    visibility: string;

    @Prop({ default: '' })
    thumbnail: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    owner: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Video' }] })
    videos: Types.ObjectId[];
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
