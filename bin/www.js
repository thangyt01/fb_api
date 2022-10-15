#!/usr/bin/env node

/**
 * Module dependencies.
 */
const config = require('config');
const _ = require('lodash');
let app = require('../src/app');
let debug = require('debug')('nodejs-apis-app:server');
const { toBool } = require('../src/libs/os');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok =
    (isDev && toBool(process.env.ENABLE_TUNNEL))
        ? require('ngrok')
        : false;
let http = require('http');

/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || '8000');
app.set('port', port);

/**
 * Create HTTP server.
 */

let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
const Logger = require('../src/libs/logger');
const log = new Logger()

async function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);

    if (ngrok) {
        let url;
        try {
            url = await ngrok.connect(port);
            log.info(`Ngrok start  : ${url}`)
        } catch (e) {
            return log.error(e);
        }
    }
}

/**
 * For socket
 */
let enableSocketServer = _.get(config, 'enableSocketServer', false);
let ioSocketServer, ioSocketClient;

if (enableSocketServer) {
    ioSocketServer = require('socket.io')(server);
    const { createClient } = require('redis');
    const redisAdapter = require('@socket.io/redis-adapter');

    const redisHost = _.get(config, 'redis.host', 'localhost');
    const redisPort = _.get(config, 'redis.port', 6379);

    const pubClient = createClient({ socket: { host: redisHost, port: redisPort } }, { detect_buffers: true, return_buffers: false });
    const subClient = createClient({ socket: { host: redisHost, port: redisPort } }, { return_buffers: true });

    pubClient.connect();
    subClient.connect();

    ioSocketServer.adapter(redisAdapter(pubClient, subClient));
}
else {
    ioSocketClient = require("socket.io-client");
}

export const io = ioSocketServer;
export const ioClient = ioSocketClient;

if (ioSocketServer) require('../src/middlewares/socket');