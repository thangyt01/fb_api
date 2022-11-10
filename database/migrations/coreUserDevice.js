'use strict';
module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable('core_user_device', {
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
        return queryInterface.dropTable('core_user_device');
    }
};