'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserRelationship = sequelize.define('UserRelationship', {
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
        status : {
            allowNull: true,
            type: DataTypes.ENUM('pending, friend, block')
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
    }, {
        tableName: 'user_relationship'
    });
    UserRelationship.associate = function (models) {
    };
    return UserRelationship;
};
