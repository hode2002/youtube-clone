import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Video', required: true })
    video: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ type: String, required: true })
    content: string;

    @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
    parent?: Types.ObjectId;

    @Prop({ type: Number, default: 0 })
    likesCount: number;

    @Prop({ type: Number, default: 0 })
    dislikesCount: number;

    @Prop({ type: Number, default: 0 })
    repliesCount: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.index({ user: 1, video: 1, parent: 1 }, { unique: true });
