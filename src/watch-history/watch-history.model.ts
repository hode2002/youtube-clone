import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class WatchHistory extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Video', required: true })
    video: Types.ObjectId;

    @Prop({ type: String, default: new Date().toISOString() })
    watchedAt: string;

    @Prop({ type: Number, default: 0 })
    progress: number;

    @Prop({ type: Number, required: true })
    duration: number;

    @Prop({ type: Boolean, default: false })
    completed: boolean;
}

export const WatchHistorySchema = SchemaFactory.createForClass(WatchHistory);
