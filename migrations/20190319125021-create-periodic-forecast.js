'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PeriodicForecasts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      startDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      endDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      tempCelsius: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      tempFahrenheit: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      tempFeelsLikeCelsius: {
        type: Sequelize.FLOAT
      },
      tempFeelsLikeFahrenheit: {
        type: Sequelize.FLOAT
      },
      windSpeedMiles: {
        type: Sequelize.INTEGER
      },
      windSpeedKmph: {
        type: Sequelize.INTEGER
      },
      windDegrees: {
        type: Sequelize.INTEGER
      },
      precipitation: {
        type: Sequelize.FLOAT
      },
      chanceOfRain: {
        type: Sequelize.INTEGER
      },
      chanceOfWind: {
        type: Sequelize.INTEGER
      },
      chanceOfSnow: {
        type: Sequelize.INTEGER
      },
      weatherIconId: {
        type: Sequelize.STRING
      },
      weatherIconUrl: {
        type: Sequelize.STRING
      },
      weatherDescription: {
        type: Sequelize.STRING
      },
      textToSpeech: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      DayForecastId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'DayForecasts',
          key: 'id'
        }
      }
    })
    .then(() => queryInterface.addConstraint('PeriodicForecasts', ['startDate', 'DayForecastId'], { type: 'unique' }))
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PeriodicForecasts');
  }
};
