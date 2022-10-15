'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        username: {
            allowNull: false,
            type: DataTypes.STRING
        },
        firstname: {
            allowNull: false,
            type: DataTypes.STRING
        },
        lastname: {
            allowNull: false,
            type: DataTypes.STRING
        },
        fullname: {
            type: DataTypes.VIRTUAL,
            get() {
                return this.get('lastName') + ' ' + this.get('firstName')
            }
        },
        birthday: {
            allowNull: true,
            type: DataTypes.DATE
        },
        gender: {
            type: DataTypes.ENUM('male', 'female', 'other'),
            defaultValue: 'other',
        },
        phone: {
            allowNull: true,
            type: DataTypes.STRING
        },
        email: {
            allowNull: true,
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING(2000)
        },
        avatar_id: {
            allowNull: true,
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        status: {
            allowNull: false,
            type: DataTypes.ENUM('draft', 'active', 'inactive'),
            defaultValue: 'active',
        },
        last_login_at: {
            allowNull: true,
            type: DataTypes.DATE
        },
        refresh_token: {
            allowNull: true,
            type: DataTypes.STRING
        },
        refresh_token_exp: {
            allowNull: true,
            type: DataTypes.DATE
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
        tableName: 'users',
    });
    User.associate = function (models) {
        // associations can be defined here
        User.belongsToMany(models.Role, {
            as: 'role',
            through: models.UserRole,
            foreignKey: 'user_id',
            otherKey: 'role_id',
        })
    };
    return User;
};
