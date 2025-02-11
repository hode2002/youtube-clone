import { Module } from '@nestjs/common';
import { createKeyv } from '@keyv/redis';
import { RedisService } from 'src/redis/redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                stores: [createKeyv(configService.get('REDIS_URL'))],
                ttl: configService.get('CACHE_TTL'),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [RedisService],
    exports: [RedisService, CacheModule],
})
export class RedisModule {}
