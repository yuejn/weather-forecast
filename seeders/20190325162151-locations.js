'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Locations', [{
      city: 'Amsterdam',
      region: 'North Holland',
      country: 'Netherlands',
      latitude: '52.379189',
      longitude: '4.899431'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Locations', null, {});
  }
};
