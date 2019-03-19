'use strict';
module.exports = (sequelize, DataTypes) => {
  const PeriodicForecast = sequelize.define('PeriodicForecast', {
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    tempCelsius: DataTypes.FLOAT,
    tempFahrenheit: DataTypes.FLOAT,
    tempFeelsLikeCelsius: DataTypes.FLOAT,
    tempFeelsLikeFahrenheit: DataTypes.FLOAT,
    windSpeedMiles: DataTypes.INTEGER,
    windSpeedKmph: DataTypes.INTEGER,
    windDegrees: DataTypes.INTEGER,
    precipitation: DataTypes.FLOAT,
    chanceOfRain: DataTypes.INTEGER,
    chanceOfWind: DataTypes.INTEGER,
    chanceOfSnow: DataTypes.INTEGER,
    weatherIconId: DataTypes.STRING,
    weatherIconUrl: DataTypes.STRING,
    weatherDescription: DataTypes.STRING,
    textToSpeech: DataTypes.TEXT
  }, {});
  PeriodicForecast.associate = function(models) {
    models.PeriodicForecast.belongsTo(models.DayForecast);
  };
  return PeriodicForecast;
};
