'use strict';
module.exports = (sequelize, DataTypes) => {
  const DayForecast = sequelize.define('DayForecast', {
    date: DataTypes.DATE,
    sunrise: DataTypes.DATE,
    sunset: DataTypes.DATE,
    maxTempCelsius: DataTypes.FLOAT,
    minTempCelsius: DataTypes.FLOAT,
    maxTempFahrenheit: DataTypes.FLOAT,
    minTempFahrenheit: DataTypes.FLOAT
  }, {});
  DayForecast.associate = function(models) {
    models.DayForecast.hasMany(models.PeriodicForecast);
    models.DayForecast.belongsTo(models.Location);
  };
  return DayForecast;
};
