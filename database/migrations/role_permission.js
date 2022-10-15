'use strict';
module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable('role_permissions', {
            id: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            role_id: {
                allowNull: false,
                type: DataTypes.INTEGER(10).UNSIGNED,
            },
            model: {
                allowNull: false,
                type: DataTypes.STRING(255)
            },
            action: {
                allowNull: false,
                type: DataTypes.ENUM('read', 'create', 'update', 'delete', 'approve',
                    'reset_password', 'view_all', 'payment', 'download'),
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
        return queryInterface.dropTable('role_permissions');
    }
};