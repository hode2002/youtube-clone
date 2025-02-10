import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtPayload } from 'src/common/types';
import { Subscription } from 'src/subscription/subscription.model';
import { ChannelService } from '../channel/channel.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectModel(Subscription.name)
        private readonly subscriptionModel: Model<Subscription>,
        @Inject(forwardRef(() => ChannelService))
        private readonly channelService: ChannelService,
        private readonly userService: UserService,
    ) {}

    async subscribe(req: Request, createSubscriptionDto: CreateSubscriptionDto) {
        const { userId } = req['user'] as JwtPayload;
        const { channelId } = createSubscriptionDto;
        const channelObjectId = new Types.ObjectId(channelId);
        const userObjectId = new Types.ObjectId(userId);

        const channel = await this.channelService.findById(channelId);
        if (!channel) throw new NotFoundException('Channel not found');

        const subscription = await this.subscriptionModel.findOne({
            subscriber: userObjectId,
            channel: channelObjectId,
        });
        if (subscription) return subscription;

        channel.subscribersCount++;

        const [subscriptionUpdated] = await Promise.all([
            this.subscriptionModel.findOneAndUpdate(
                {
                    subscriber: userObjectId,
                    channel: channelObjectId,
                },
                {
                    $setOnInsert: {
                        subscriber: userObjectId,
                        channel: channelObjectId,
                    },
                },
                { upsert: true, new: true },
            ),
            this.userService.findByIdAndUpdate(userId, {
                $push: { subscriptions: channel._id },
            }),
            channel.save(),
        ]);

        return subscriptionUpdated;
    }

    async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
        const channelUpdated = await this.subscriptionModel.findByIdAndUpdate(
            id,
            {
                notificationType: updateSubscriptionDto.notificationType,
            },
            { new: true },
        );
        if (!channelUpdated) throw new NotFoundException('Subscription not found');
        return channelUpdated;
    }

    async unsubscribe(req: Request, channelId: string) {
        const { userId } = req['user'] as JwtPayload;
        const channelObjectId = new Types.ObjectId(channelId);
        const userObjectId = new Types.ObjectId(userId);

        const [Subscription, channel] = await Promise.all([
            this.subscriptionModel.findOne({
                subscriber: userObjectId,
                channel: channelObjectId,
            }),
            this.channelService.findById(channelId),
        ]);
        if (!Subscription) throw new NotFoundException('Subscription not found');
        if (!channel) throw new NotFoundException('Channel not found');
        channel.subscribersCount--;

        const [subscriptionDeleted] = await Promise.all([
            this.subscriptionModel.findOneAndDelete(
                {
                    subscriber: userObjectId,
                    channel: channelObjectId,
                },
                { new: true },
            ),
            this.userService.findByIdAndUpdate(userId, {
                $pull: { subscriptions: channelObjectId },
            }),
            channel.save(),
        ]);

        return subscriptionDeleted;
    }

    async deleteMultiple(channelId: string) {
        const isExist = await this.subscriptionModel.findOne({
            channel: channelId,
        });
        if (!isExist) {
            throw new NotFoundException('Subscription not found');
        }
        return await this.subscriptionModel.deleteMany({ channel: channelId });
    }
}
