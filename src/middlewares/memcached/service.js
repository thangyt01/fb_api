const _ = require('lodash');
const config = require('config');
const memcacheConfig = _.get(config, 'memcached', null);
const Memcached = require('./index');
Memcached.config.maxValue = _.get(memcacheConfig, 'max_value', Memcached.config.maxValue);
Memcached.config.poolSize = _.get(memcacheConfig, 'pool_size', Memcached.config.poolSize);
Memcached.config.maxKeySize = _.get(memcacheConfig, 'max_key_size', Memcached.config.maxKeySize);
Memcached.config.timeout = _.get(memcacheConfig, 'timeout', Memcached.config.timeout);
Memcached.config.debug = _.get(memcacheConfig, 'debug', false);
const ENV = _.get(config, 'env', null);
const EXPRIRATION = _.get(memcacheConfig, 'max_expriration', Memcached.config.maxExpiration);

const memcached = new Memcached(_.get(memcacheConfig, 'host', '127.0.0.1') + ":" + _.get(memcacheConfig, 'port', '11211'));

export function getMemcached(key) {
    key = ENV ? ENV + key : key;
    return new Promise((resolve, reject) => {
        try {
            memcached.get(key, function (err, data) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        }
        catch (err) {
            reject(err);
        }
    });
}

export function setMemcached(key, value, expiredTime = false) {
    key = ENV ? ENV + key : key;
    return new Promise((resolve, reject) => {
        try {
            memcached.set(key, value, expiredTime || EXPRIRATION, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(value);
                }
            });
        }
        catch (err) {
            reject(err);
        }
    });
}

export function delMemcached(key, prefix = '') {
    return new Promise((resolve, reject) => {
        try {
            if (prefix) {
                key = prefix + key
            } else {
                key = ENV ? ENV + key : key;
            }

            memcached.del(key, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        }
        catch (err) {
            reject(err);
        }
    });
}