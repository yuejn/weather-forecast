'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    areaName: DataTypes.STRING,
    region: DataTypes.STRING,
    country: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT
  }, {});
  Location.associate = function(models) {
    models.Location.hasMany(models.DayForecast);
  };
  return Location;
};
