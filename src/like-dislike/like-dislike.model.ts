import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LikeDislikeDocument = LikeDislike & Document;

@Schema({ timestamps: true })
export class LikeDislike {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ enum: ['video', 'comment'], required: true })
    targetType: string;

    @Prop({ type: Types.ObjectId, required: true })
    target: Types.ObjectId;

    @Prop({ enum: ['like', 'dislike'], required: true })
    type: string;
}

export const LikeDislikeSchema = SchemaFactory.createForClass(LikeDislike);
