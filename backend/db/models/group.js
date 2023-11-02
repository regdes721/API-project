'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.belongsTo(
        models.User,
        {
          foreignKey: 'organizerId'
        }
      );
      Group.hasMany(
        models.GroupImage,
        {
          foreignKey: 'groupId',
          onDelete: 'CASCADE',
          hooks: true
        }
      );
      Group.hasMany(
        models.Venue,
        {
          foreignKey: 'groupId',
          onDelete: 'CASCADE',
          hooks: true,
          as: 'venues'
        }
      );
      Group.belongsToMany(
        models.User,
        {
          through: models.Membership,
          foreignKey: 'groupId',
          otherKey: 'userId'
        }
      );
      Group.belongsToMany(
        models.Venue,
        {
          through: models.Event,
          foreignKey: 'groupId',
          otherKey: 'venueId',
          as: 'eventsVenues'
        }
      );
      Group.hasMany(
        models.Event,
        {
          foreignKey: 'groupId',
          onDelete: 'CASCADE',
          hooks: true
        }
      );
      Group.hasMany(
        models.Membership,
        {
          foreignKey: 'groupId',
          onDelete: 'CASCADE',
          hooks: true
        }
      );
    }
  }
  Group.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: {
          args: [1, 60],
          // msg: "Name must be 60 characters or less"
        }
      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [50, 256]
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Online', 'In person']]
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
