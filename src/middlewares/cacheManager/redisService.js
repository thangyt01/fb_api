import { CacheBaseService } from './cacheBaseService'
const redisDb = require('../../../database/redisDb')

export class RedisService extends CacheBaseService {
    static get driver() {
        return redisDb
    }

    /**
     *
     * @param {*} key
     * @returns
     */
    static async get(key) {
        try {
            const data = await this.driver.get(key)
            return data
        } catch (e) {
            return false
        }
    }

    /**
     *
     * @param {*} key
     * @param {*} value
     * @param {*} expiredTime
     * @returns
     */
    static async set(key, value, exp = -1) {
        try {
            if (exp < 0) exp = 2592000 // 30days
            return await this.driver.setEx(key, exp, JSON.stringify(value))
        } catch (e) {
            return false
        }
    }

    /**
     *
     * @param {*} key
     * @returns
     */
    static async delete(key) {
        try {
            return await this.driver.del(key)
        } catch (e) {
            return false
        }
    }
}
