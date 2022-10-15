import { CacheBaseService } from './cacheBaseService'
const memcached = require('../memcached/service')

export class MemcachedService extends CacheBaseService {
    static get driver() {
        return memcached
    }

    /**
     *
     * @param {*} key
     * @returns
     */
    static get(key) {
        return this.driver.getMemcached(key)
    }

    /**
     *
     * @param {*} key
     * @param {*} value
     * @param {*} expiredTime
     * @returns
     */
    static set(key, value, expiredTime = false) {
        return this.driver.setMemcached(key, value, expiredTime)
    }

    /**
     *
     * @param {*} key
     * @param {*} prefix
     * @returns
     */
    static delete(key, prefix = '') {
        return this.driver.delMemcached(key, prefix)
    }
}
