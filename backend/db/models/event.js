'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.hasMany(
        models.EventImage,
        {
          foreignKey: 'eventId',
          onDelete: 'CASCADE',
          hooks: true
        }
      );

      Event.belongsToMany(
        models.User,
        {
          through: models.Attendance,
          foreignKey: 'eventId',
          otherKey: 'userId'
        }
      );

      Event.belongsTo(
        models.Venue,
        {
          foreignKey: 'venueId'
        }
      );

      Event.belongsTo(
        models.Group,
        {
          foreignKey: 'groupId'
        }
      );
      Event.hasMany(
        models.Attendance,
        {
          foreignKey: 'eventId',
          onDelete: 'CASCADE',
          hooks: true
        }
      )
    }
  }
  Event.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    venueId: {
      type: DataTypes.INTEGER
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 256]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Online', 'In person']]
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(9, 2),
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
