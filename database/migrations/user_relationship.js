'use strict';
module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable('user_relationship', {
            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            user_id: {
                allowNull: false,
                type: DataTypes.INTEGER(11).UNSIGNED,
            },
            other_user_id: {
                allowNull: false,
                type: DataTypes.INTEGER(11).UNSIGNED,
            },
            role_id: {
                allowNull: true,
                type: DataTypes.ENUM('pending', 'block', 'friend'),
            },
            point: {
                allowNull: false,
                type: DataTypes.INTEGER(11).UNSIGNED,
                defaultValue: 0
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
        return queryInterface.dropTable('user_relationship');
    }
};
