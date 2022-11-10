'use strict';
const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const CoreUserDevice = sequelize.define('CoreUserDevice', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        user_id: {
            allowNull: true,
            type: DataTypes.INTEGER(11).UNSIGNED,
        },
        device_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER(1),
            defaultValue: 1
        },
        last_login_at: {
            allowNull: true,
            type: DataTypes.DATE,
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
        tableName: 'core_user_device',
        timestamps: false
    });

    CoreUserDevice.associate = function (models) {
        CoreUserDevice.belongsTo(models.CoreDevice, {
            as: 'user_to_device',
            foreignKey: 'device_id',
            targetKey: 'device_id'
        });
    };

    return CoreUserDevice;
};
