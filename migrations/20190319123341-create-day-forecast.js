'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DayForecasts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      sunrise: {
        allowNull: false,
        type: Sequelize.DATE
      },
      sunset: {
        allowNull: false,
        type: Sequelize.DATE
      },
      moonrise: {
        type: Sequelize.DATE
      },
      moonset: {
        type: Sequelize.DATE
      },
      moonPhase: {
        type: Sequelize.STRING
      },
      maxTempCelsius: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      minTempCelsius: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      maxTempFahrenheiht: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      minTempFahrenheiht: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      LocationId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: 'Locations',
          key: 'id'
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('DayForecasts');
  }
};
