import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Search extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: String, required: true })
    query: string;

    @Prop({ type: Number, default: 0 })
    searchCount: number;

    @Prop({ type: Date, default: Date.now })
    lastSearchedAt: Date;
}

export const SearchSchema = SchemaFactory.createForClass(Search);
