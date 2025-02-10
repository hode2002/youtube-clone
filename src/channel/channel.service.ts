import { Injectable } from '@nestjs/common';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserRole } from 'src/user/user.model';
import { UserService } from '../user/user.service';
import { Request } from 'express';
import { JwtPayload } from 'src/common/types';
import { Channel } from 'src/channel/channel.model';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Injectable()
export class ChannelService {
    constructor(
        @InjectModel(Channel.name)
        private readonly channelModel: Model<Channel>,
        private readonly userService: UserService,
        private readonly subscriptionService: SubscriptionService,
    ) {}

    async create(request: Request) {
        const { userId } = request['user'] as JwtPayload;
        const userObjectId = new Types.ObjectId(userId);
        const user = await this.userService.findById(userId);

        const channel = await this.channelModel
            .findOne({ owner: userObjectId })
            .populate('owner')
            .exec();
        if (channel) return channel;

        user.hasChannel = true;
        user.role = UserRole.CHANNEL;
        const { avatarUrl, fullName, username } = user;

        const [newChannel] = await Promise.all([
            await this.channelModel.create({
                avatarUrl,
                name: fullName,
                uniqueName: username,
                owner: userObjectId,
            }),
            await user.save(),
        ]);

        return await newChannel.populate('owner');
    }

    async findById(id: string) {
        return await this.channelModel.findById(id).populate('owner').exec();
    }

    async update(id: string, updateChannelDto: UpdateChannelDto) {
        return await this.channelModel.findByIdAndUpdate(id, updateChannelDto, { new: true });
    }
}
