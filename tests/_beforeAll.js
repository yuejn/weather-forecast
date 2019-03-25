'use strict';
const models = require('../models');
const nock = require('nock');
const chai = require('chai');
const factories = require('chai-factories');
chai.use(factories);

// Factories
chai.factory('location', {
  city: 'Amsterdam',
  country: 'Netherlands'
});

chai.factory('dayForecast', {
  date: '2019-03-20',
  sunrise: '2019-03-20 06:48',
  sunset: '2019-03-20 18:49',
  maxTempCelsius: 9,
  maxTempFahrenheit: 48,
  minTempCelsius: 5,
  minTempFahrenheit: 40,
  LocationId: 1
});

chai.factory('periodicForecast', {
  tempCelsius: 9,
  tempFahrenheit: 47,
  tempFeelsLikeCelsius: 4,
  tempFeelsLikeFahrenheit: 38,
  windSpeedMiles: 10,
  windSpeedKmph: 16,
  windDegrees: 300,
  precipitation: 2.6,
  chanceOfRain: 99,
  chanceOfWind: 0,
  chanceOfSnow: 0,
  weatherIconId: '119',
  weatherIconUrl: 'http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png',
  weatherDescription: 'Patchy rain possible'
})

// Mock responses
const worldweatheronlineResponse = require('./responses/worldweatheronline.json');

// Truncate the database
beforeEach(done => {
  models.sequelize
    .sync({
      force: true,
      match: /_test$/,
      logging: false
    })
    .then(() => {
      done();
    });
});

// Replace API calls with mock data
beforeEach(() => {
  nock('https://api.worldweatheronline.com')
    .get('/premium/v1/weather.ashx')
    .query(true)
    // .query({
    //   q: 'Amsterdam',
    //   tp: '3',
    //   includelocation: 'yes',
    //   fx24: 'yes',
    //   format: 'json',
    //   num_of_days: '2',
    //   date_format: 'utcDateTime'
    // })
    .reply(200, worldweatheronlineResponse);
});
