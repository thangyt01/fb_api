'use strict';
const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const CoreDevice = sequelize.define('CoreDevice', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        device_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        firebase_token: {
            type: DataTypes.STRING,
            allowNull: true
        },
        created_by: {
            allowNull: true,
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        updated_by: {
            allowNull: true,
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        created_at: {
            allowNull: true,
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        updated_at: {
            allowNull: true,
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        deleted_at: {
            allowNull: true,
            type: DataTypes.DATE,
        }
    }, {
        tableName: 'core_device',
        timestamps: false
    });

    CoreDevice.associate = function (models) {
        CoreDevice.belongsTo(models.CoreUserDevice, {
            as: 'user_device',
            foreignKey: 'device_id',
            targetKey: 'device_id',
        })
    };

    return CoreDevice;
};
