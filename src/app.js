const expressLoader = require('./loaders/expressLoader')
const monitorLoader = require('./loaders/monitorLoader')
const publicLoader = require('./loaders/publicLoader')
const swaggerLoader = require('./loaders/swaggerLoader')
const winstonLoader = require('./loaders/winstonLoader')

// logging
winstonLoader()

// database
require('../database/models')

// mongodb
require('../database/mongoDb')

// memcached
require('./middlewares/memcached')

// redis
// require('../database/redisDb')

//elasticsearch
require('../database/elasticSearch')

const bannerLogger = require('./libs/banner')
const Logger = require('./libs/logger')
const { errorLoader } = require('./middlewares/error')
const log = new Logger(__filename)

// express
let app = expressLoader()

/**
 * NODEJS API BOILERPLATE
 * ----------------------------------------
 *
 * This is a boilerplate for Node.js Application written in Vanilla Javascript.
 * The basic layer of this app is express. For further information visit
 * the 'README.md' file.
 */
async function initApp() {
    // monitor
    monitorLoader(app)

    // swagger
    swaggerLoader(app)

    // public Url
    publicLoader(app)

    //handle error
    errorLoader(app)
}

initApp()
    .then(() => bannerLogger(log))
    .catch((error) => console.error('Application is crashed: ' + error))

module.exports = app