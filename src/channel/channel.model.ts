import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChannelDocument = Channel & Document;

export enum ChannelStatus {
    ACTIVE = 'active',
    BANNED = 'banned',
    DELETED = 'deleted',
}

@Schema({ timestamps: true })
export class Channel {
    @Prop({ required: true, unique: true })
    uniqueName: string;

    @Prop({ required: true })
    name: string;

    @Prop({ default: '' })
    description: string;

    @Prop({ default: '' })
    avatarUrl: string;

    @Prop({ default: '' })
    banner: string;

    @Prop({ default: 0 })
    subscribersCount: number;

    @Prop({ default: 0 })
    videosCount: number;

    @Prop({ enum: ChannelStatus, default: ChannelStatus.ACTIVE })
    status: ChannelStatus;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    owner: Types.ObjectId;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
