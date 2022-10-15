import { MemcachedService } from './memcachedService';
import { RedisService } from './redisService';

const Logger = require('../../libs/logger')
const log = new Logger(__dirname)

const config = require('config');

export const DRIVER = {
    MEMCACHED: 'memcached',
    REDIS: 'redis',
    FILE: 'file',
};

export class CacheFactory {
    /**
     *
     * @param {*} driver
     */
    static getService() {
        try {
            const driver = config.get('cacheManager.driver');
            switch (driver) {
                case DRIVER.MEMCACHED:
                    return MemcachedService;
                case DRIVER.REDIS:
                    return RedisService;
                default:
                    return null;
            }
        } catch (e) {
            log.error(`[CacheFactory] có lỗi`, e);
            return null;
        }
    }
}
