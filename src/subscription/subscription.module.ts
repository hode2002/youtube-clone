import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { Subscription, SubscriptionSchema } from 'src/subscription/subscription.model';
import { AtJwtStrategy } from 'src/auth/strategy';
import { ChannelModule } from 'src/channel/channel.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Subscription.name, schema: SubscriptionSchema }]),
        forwardRef(() => ChannelModule),
        UserModule,
    ],
    controllers: [SubscriptionController],
    providers: [SubscriptionService, AtJwtStrategy],
    exports: [SubscriptionService],
})
export class SubscriptionModule {}
