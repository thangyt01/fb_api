'use strict';
module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define('RolePermission', {
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
      type: DataTypes.ENUM('user', 'service')
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
  }, {
    tableName: 'role_permissions'
  });
  RolePermission.associate = function (models) {
    // associations can be defined here
    RolePermission.belongsTo(models.Role, {
      as: 'role',
      foreignKey: 'role_id',
      targetKey: 'id',
    });
  };
  return RolePermission;
};
