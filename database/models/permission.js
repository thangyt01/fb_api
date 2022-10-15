'use strict';
module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    model: {
      allowNull: false,
      type: DataTypes.ENUM('user', 'service'),
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
    tableName: 'permissions'
  });
  Permission.associate = function (models) {
    // associations can be defined here
    // Permission.belongsToMany(models.Role, {
    //   as: 'role',
    //   through: models.RolePermission,
    //   foreignKey: '',
    //   otherKey: 'user_id',
    // });
  };
  return Permission;
};
