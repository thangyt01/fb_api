'use strict';
module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        description: {
            allowNull: true,
            type: DataTypes.STRING,
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
        tableName: 'roles'
    });
    Role.associate = function (models) {
        // associations can be defined here
        Role.hasMany(models.RolePermission, {
            as: 'permissions',
            foreignKey: 'role_id',
            sourceKey: 'id',
        })
        Role.belongsToMany(models.User, {
            as: 'user',
            through: models.UserRole,
            foreignKey: 'role_id',
            otherKey: 'user_id',
        });
    };
    return Role;
};
