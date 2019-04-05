'use strict';
module.exports = (sequelize, DataTypes) => {
  const DayForecast = sequelize.define('DayForecast', {
    date: {
      allowNull: false,
      index: true,
      type: DataTypes.DATE
    },
    sunrise: {
      allowNull: false,
      type: DataTypes.DATE
    },
    sunset: {
      allowNull: false,
      type: DataTypes.DATE
    },
    maxTempCelsius: {
      allowNull: false,
      type: DataTypes.FLOAT
    },
    minTempCelsius: {
      allowNull: false,
      type: DataTypes.FLOAT
    },
    maxTempFahrenheit: {
      allowNull: false,
      type: DataTypes.FLOAT
    },
    minTempFahrenheit: {
      allowNull: false,
      type: DataTypes.FLOAT
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['date', 'LocationId']
      },
      {
        method: 'BETREE',
        fields: ['date']
      }
    ]
  });
  DayForecast.associate = models => {
    DayForecast.hasMany(models.PeriodicForecast);
    DayForecast.belongsTo(models.Location);
  };
  return DayForecast;
};
