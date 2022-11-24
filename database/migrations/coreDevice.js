'use strict';
module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable('core_device', {
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
            },
            updated_at: {
                allowNull: true,
                type: DataTypes.DATE,
            },
            deleted_at: {
                allowNull: true,
                type: DataTypes.DATE,
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('core_device');
    }
};