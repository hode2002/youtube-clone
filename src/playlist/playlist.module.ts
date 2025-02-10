import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { AtJwtStrategy, RfJwtStrategy } from 'src/auth/strategy';
import { Playlist, PlaylistSchema } from 'src/playlist/playlist.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Playlist.name, schema: PlaylistSchema }]),
        UserModule,
    ],
    controllers: [PlaylistController],
    providers: [PlaylistService, AtJwtStrategy, RfJwtStrategy],
    exports: [PlaylistService],
})
export class PlaylistModule {}
