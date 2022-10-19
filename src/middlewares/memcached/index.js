const Logger = require('../../libs/logger')
const log = new Logger()
log.info('Memcached is running.')

module.exports = require('memcached')