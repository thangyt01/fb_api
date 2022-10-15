const Redis = require("redis")
const _ = require('lodash')
const config = require('config')

const Logger = require('../../src/libs/logger')
const log = new Logger(__dirname)

const host = _.get(config, 'redis.host', '127.0.0.1')
const username = _.get(config, 'redis.username', false)
const password = _.get(config, 'redis.password', false)
const port = _.get(config, 'redis.port', 6379)
const db = _.get(config, 'redis.db', 0)
const connectStr = `redis://${username}:${password}@${host}:${port}/${db}`

const redisDb = new Redis(connectStr)

redisDb.on('error', (err) => log.error('Redis Error', err))
redisDb.connect().then(() => {
  log.info(`redis connected`)
})

/**
 * Get object from redis in JSON format
 * @param {*} key
 * @returns Object
 */
redisDb.getWithJson = async (key) => {
  try {
    // Get user's data from redis
    let result = await redisDb.get(key)
    return result ? JSON.parse(result) : false
  } catch (e) {
    return false
  }
}

/**
 * Create the object by Key, store value in JSON format
 * @param {*} key
 * @param {*} data
 * @returns boolean
 */
redisDb.setWithJson = async (key, data) => {
  try {
    // Get user's data from redis
    return await redisDb.set(key, JSON.stringify(data))
  } catch (e) {
    return false
  }
}

module.exports = redisDb