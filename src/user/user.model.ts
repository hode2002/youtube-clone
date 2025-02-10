import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
    USER = 'USER',
    CHANNEL = 'CHANNEL',
    ADMIN = 'ADMIN',
}

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    fullName: string;

    @Prop({ default: '' })
    avatarUrl: string;

    @Prop()
    phone: string;

    @Prop({ enum: ['male', 'female', 'other'], default: 'other' })
    gender: string;

    @Prop()
    dateOfBirth: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Prop()
    hashedRefreshToken: string;

    @Prop({ default: false })
    hasChannel: boolean;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Channel' }] })
    subscriptions: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
