'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // User.hasMany(
      //   models.Group,
      //   {
      //     foreignKey: 'organizerId'
      //   }
      // );

      // User.belongsToMany(
      //   models.Group,
      //   {
      //     through: models.Membership,
      //     foreignKey: 'userId',
      //     otherKey: 'groupId'
      //   }
      // )
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isCapitalized(value) {
          if (value[0] !== value[0].toUpperCase()) throw new Error('First letter must be capitalized')
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      isCapitalized(value) {
        if (value[0] !== value[0].toUpperCase()) throw new Error('First letter must be capitalized')
      }
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.")
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
      }
    }
  });
  return User;
};
