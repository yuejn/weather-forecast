'use strict';
module.exports = (sequelize, DataTypes) => {
  const PeriodicForecast = sequelize.define('PeriodicForecast', {
    startDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    endDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    tempCelsius: {
      allowNull: false,
      type: DataTypes.FLOAT
    },
    tempFahrenheit: {
      allowNull: false,
      type: DataTypes.FLOAT
    },
    tempFeelsLikeCelsius: {
      type: DataTypes.FLOAT
    },
    tempFeelsLikeFahrenheit: {
      type: DataTypes.FLOAT
    },
    windSpeedMiles: {
      type: DataTypes.INTEGER
    },
    windSpeedKmph: {
      type: DataTypes.INTEGER
    },
    windDegrees: {
      type: DataTypes.INTEGER
    },
    precipitation: {
      type: DataTypes.FLOAT
    },
    chanceOfRain: {
      type: DataTypes.INTEGER
    },
    chanceOfWind: {
      type: DataTypes.INTEGER
    },
    chanceOfSnow: {
      type: DataTypes.INTEGER
    },
    weatherIconId: {
      type: DataTypes.STRING
    },
    weatherIconUrl: {
      type: DataTypes.STRING
    },
    weatherDescription: {
      type: DataTypes.STRING
    },
    textToSpeech: {
      type: DataTypes.TEXT
    }
  }, {
    indexes: [{
      unique: true,
      fields: ['startDate', 'DayForecastId']
    }]
  });
  PeriodicForecast.associate = models => {
    PeriodicForecast.belongsTo(models.DayForecast);
  };
  return PeriodicForecast;
};
