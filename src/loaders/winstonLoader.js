const { configure, format, transports } = require('winston')
require('winston-daily-rotate-file')

const env = require('../configs/env')

module.exports = () => {
    configure({
        transports: [
            new transports.Console({
                level: env.log.level,
                handleExceptions: true,
                format:
                    env.node !== 'development'
                        ? format.combine(format.json())
                        : format.combine(format.colorize(), format.simple()),
            }),
            new transports.DailyRotateFile({
                filename: `${env.log.output}/%DATE%.log`,
                datePattern: 'YYYYMMDD',
                format: format.combine(
                    format.timestamp({
                        format: 'YYYY-MM-DD HH:mm:ss'
                    }),
                    format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
                ),
                // maxFiles: env.log.maxFiles,
            })
        ],
    })
}
