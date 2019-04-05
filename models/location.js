'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latitude: {
      type: DataTypes.FLOAT
    },
    longitude: {
      type: DataTypes.FLOAT
    }
  }, {
    indexes: [{
      unique: true,
      fields: ['city', 'country']
    }]
  });
  Location.associate = models => {
    Location.hasMany(models.DayForecast);
  };
  return Location;
};
