import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}

    async get<T>(key: string): Promise<T | null> {
        return (await this.cacheManager.get<T>(key)) || null;
    }

    async set<T>(
        key: string,
        value: T,
        ttl: number = 5 * 60 * 1000, // 15 mins
    ) {
        await this.cacheManager.set(key, value, ttl);
    }

    async del(key: string) {
        await this.cacheManager.del(key);
    }
}
