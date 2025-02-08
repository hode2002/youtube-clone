import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.model';
import { GoogleProfile } from 'src/common/types';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {}

    async create(googleProfile: GoogleProfile) {
        const user = await this.userModel.findOne({ email: googleProfile.email }).lean();
        if (user) return user;
        return await this.userModel.create({
            username: '@' + googleProfile.email.split('@')[0],
            email: googleProfile.email,
            fullName: googleProfile.name,
            avatarUrl: googleProfile.picture,
            isActive: true,
        });
    }

    async findAll() {
        return await this.userModel.find();
    }

    async findByEmail(email: string) {
        return await this.userModel.findOne({
            email,
        });
    }

    async findById(id: string) {
        return await this.userModel.findOne({
            id,
        });
    }

    async updateByEmail(email: string, updateUserDto: any) {
        return await this.userModel.updateOne({ email }, { ...updateUserDto });
    }

    async findByIdAndUpdate(id: string, updateUserDto: any) {
        return await this.userModel.findByIdAndUpdate(id, { ...updateUserDto });
    }
}
