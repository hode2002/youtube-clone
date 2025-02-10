import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

export enum NotificationType {
    ALL = 'all',
    NONE = 'none',
}

@Schema({ timestamps: true })
export class Subscription {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    subscriber: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Channel', required: true })
    channel: Types.ObjectId;

    @Prop({ enum: NotificationType, default: NotificationType.NONE })
    notificationType: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
