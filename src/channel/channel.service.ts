import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from 'diagnostics_channel';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserRole } from 'src/user/user.model';
import { UserService } from '../user/user.service';
import { Request } from 'express';
import { JwtPayload } from 'src/common/types';

@Injectable()
export class ChannelService {
    constructor(
        @InjectModel(Channel.name)
        private readonly channelModel: Model<Channel>,
        private readonly userService: UserService,
    ) {}

    async create(request: Request, createChannelDto: CreateChannelDto) {
        const { userId } = request['user'] as JwtPayload;
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const channel = await this.channelModel
            .findOne({ owner: userObjectId })
            .populate('owner')
            .exec();
        if (channel) return channel;

        await this.userService.findByIdAndUpdate(userId, {
            role: UserRole.CHANNEL,
            hasChannel: true,
        });

        return this.channelModel
            .create({
                ...createChannelDto,
                owner: userObjectId,
            })
            .then((channel) => channel.populate('owner'));
    }

    findAll() {
        return `This action returns all channel`;
    }

    async findById(id: string) {
        return await this.channelModel.findById(id).populate('owner').exec();
    }

    update(id: number, updateChannelDto: UpdateChannelDto) {
        return `This action updates a #${id} channel`;
    }

    remove(id: number) {
        return `This action removes a #${id} channel`;
    }
}
