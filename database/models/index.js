'use strict';

import _ from "lodash";

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require('config');
const dbConfig = config.get('database');
const db = {};

const Logger = require('../../src/libs/logger')
const log = new Logger(__dirname)

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
    const slaves = _.get(config, 'db_slaves', [
        { host: dbConfig.host, database: dbConfig.database, username: dbConfig.username, password: dbConfig.password },
    ]);
    sequelize = new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password,
        {
            host: dbConfig.host,
            port: dbConfig.port || 3306,
            dialect: 'mysql',
            replication: {
                read: slaves,
                write: { host: dbConfig.host, database: dbConfig.database, username: dbConfig.username, password: dbConfig.password }
            },
            logging: config.get("logQuery") || false,
            freezeTableName: false,
            operatorsAliases: Sequelize.Op,
            define: {
                underscored: false,
                charset: 'utf8mb4',
                timestamps: true,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                deletedAt: 'deleted_at',
                paranoid: true,
            },
            dialectOptions: {
                supportBigNumbers: true,
                bigNumberStrings: true,
                dateStrings: true,
                typeCast: function (field, next) { // for reading from database
                    if (field.type === 'DATETIME') {
                        return field.string()
                    }
                    return next()
                },
            },
            // quoteIdentifiers: false,
            timezone: '+07:00',
            keepDefaultTimezone: true,
            pool: {
                max: 10,
                min: 0,
                idle: 30000,
                acquire: 60000,
            }
        }
    );
}

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

try {
    sequelize.authenticate()
    log.debug(`Connect to the database successfully !!!`)
} catch (error) {
    log.error(`Unable to connect to the database !!!`)
}

module.exports = db;
