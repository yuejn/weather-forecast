'use strict';
module.exports = (sequelize, DataTypes) => {
  const DayForecast = sequelize.define('DayForecast', {
    date: DataTypes.DATE,
    sunrise: DataTypes.DATE,
    sunset: DataTypes.DATE,
    moonrise: DataTypes.DATE,
    moonset: DataTypes.DATE,
    moonPhase: DataTypes.STRING,
    maxTempCelsius: DataTypes.FLOAT,
    minTempCelsius: DataTypes.FLOAT,
    maxTempFahrenheiht: DataTypes.FLOAT,
    minTempFahrenheiht: DataTypes.FLOAT
  }, {});
  DayForecast.associate = function(models) {
    models.DayForecast.hasMany(models.PeriodicForecast);
  };
  return DayForecast;
};
