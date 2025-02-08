import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { AtJwtStrategy, RfJwtStrategy } from 'src/auth/strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel } from 'diagnostics_channel';
import { ChannelSchema } from 'src/channel/channel.model';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Channel.name, schema: ChannelSchema }]),
        UserModule,
    ],
    controllers: [ChannelController],
    providers: [ChannelService, AtJwtStrategy, RfJwtStrategy],
    exports: [ChannelService],
})
export class ChannelModule {}
