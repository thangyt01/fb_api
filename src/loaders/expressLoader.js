const session = require('express-session')
const compression = require('compression')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const morgan = require('morgan')
const path = require('path')
const rfs = require('rotating-file-stream')
const xss = require('xss-clean')

const env = require('../configs/env')
const { customizeLimiter } = require('../middlewares/rate-limit')
const routerManager = require('../routes/index')

const { SECRET_SESSION } = require('../components/auth/authConstant')

module.exports = () => {
    const app = express()

    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    app.use(cookieParser())

    app.use(session({
        secret: SECRET_SESSION,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true }
    }));
    // set log request
    app.use(morgan('dev'))

    // log configuration
    const accessLogStream = rfs('access.log', {
        interval: '1d', // rotate daily
        path: path.join(__dirname, '../../logs'),
    });
    // setup the logger
    app.use(morgan('combined', { stream: accessLogStream }))

    // set security HTTP headers
    app.use(helmet())

    // parse json request body
    app.use(express.json())

    // parse urlencoded request body
    app.use(express.urlencoded({ extended: true }))

    // sanitize request data
    app.use(xss())
    app.use(mongoSanitize())

    // gzip compression
    app.use(compression())

    // set cors blocked resources
    app.use(cors({
        origin: '*',
        methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
        exposedHeaders: ['Content-Length', 'Authorization', 'Accept-Language'],
        credentials: true,
    }))
    app.options('*', cors())

    // setup limits
    if (env.isProduction) {
        app.use('/api/auth', customizeLimiter)
    }

    // api routes
    routerManager(app)

    return app
}
