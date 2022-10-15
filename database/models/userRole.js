'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define('UserRole', {
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
        role_id: {
            allowNull: false,
            type: DataTypes.INTEGER(11).UNSIGNED,
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
    }, {
        tableName: 'user_role'
    });
    UserRole.associate = function (models) {
        // associations can be defined here
    };
    return UserRole;
};
