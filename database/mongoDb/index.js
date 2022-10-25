const mongoose = require("mongoose")
const config = require('config')
const _ = require('lodash')
const Logger = require('../../src/libs/logger')
const log = new Logger()

const username = _.get(config, 'mongoDB.username', 'root')
const password = _.get(config, 'mongoDB.password', 'password')
const host = _.get(config, 'mongoDB.host', 'localhost')
const port = _.get(config, 'mongoDB.port', 27017)
const database = _.get(config, 'mongoDB.database', 'database')
const parameter = _.get(config, 'mongoDB.parameter', 'authSource=admin')
const baseUri = _.get(config, 'mongoDB.uri', null)

// get Uri from config if exist
let uri = baseUri || `mongodb://${username}:${password}@${host}:${port}/${database}?${parameter}`

const connectMongo = async () => {
    await mongoose.connect(uri, { useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true })
        .then(() => log.info(`MongoDB connected uri: ${uri} ...`))
        .catch(e => log.error(`Error connect MongoDB ${e}`))
}

connectMongo()