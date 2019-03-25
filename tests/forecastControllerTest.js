'use strict';

const models = require('../models');
const forecast = require('../helpers');
const chai = require('chai');
const expect = chai.expect;

const nock = require('nock');
const github = require('./responses/github.json');
const worldweatheronlineResponse = require('./responses/worldweatheronline.json');

describe('forecastToSpeech()', () => {
  it('should build the sentences', () => {
    const input = {
      tempCelsius: 4,
      tempFeelsLikeCelsius: 1,
      weatherDescription: 'Partly cloudly',
      chanceOfRain: 84
    }
    const result = forecast.forecastToSpeech(input);
    expect(result).to.equal('It\'s going to be partly cloudly with a temperature of 4 degrees. It will feel like 1. There is a high chance of rain.');
  });
});

//
// describe('Fetch forecast from worldweatheronline.com', () => {
//     before(done => {
//       models.sequelize
//         .sync({ force: true, match: /_test$/, logging: false })
//         .then(() => {
//           done();
//         })
//     });
//
//   beforeEach(() => {
//     nock('https://api.worldweatheronline.com')
//       .get('/premium/v1/weather.ashx')
//       .query(true)
//       // .query({
//       //   q: 'Amsterdam',
//       //   tp: '3',
//       //   includelocation: 'yes',
//       //   fx24: 'yes',
//       //   format: 'json',
//       //   num_of_days: '2',
//       //   date_format: 'utcDateTime'
//       // })
//       .reply(200, worldweatheronlineResponse);
//   });
//
//   it('Gets today\'s forecast for Amsterdam', () => {
//     return forecast.getForecast('Amsterdam, Netherlands')
//       .then(res => {
//         const today = '2019-03-19';
//         expect(typeof res.data).to.equal('object');
//         expect(res.data.request[0].query).to.equal('Amsterdam, Netherlands');
//         expect(res.data.weather.length).to.equal(2);
//         expect(res.data.weather[0].hourly.length).to.equal(9);
//
//         const dayForecast = res.data.weather[0];
//
//         expect(dayForecast.date).to.equal(today);
//         expect(typeof dayForecast.astronomy).to.equal('object');
//       });
//   });
//
//   it('finds or creates the queried location', () => {
//     return forecast.findCreateLocation({
//       name: 'Amsterdam'
//     }).then(res => {
//       expect(res).to.equal(1);
//     });
//   });
//
//   it('finds or creates the DayForecast', async () => {
//     const location = await forecast.findCreateLocation({
//       name: 'Amsterdam'
//     });
//
//     return forecast.findCreateDayForecast(
//       location,
//       {
//         date: '2019-03-19',
//         sunrise: new Date('2019-03-19 06:46 AM'),
//         sunset: new Date('2019-03-19 06:51 PM'),
//         moonrise: new Date('2019-03-19 04:39 PM'),
//         moonset: new Date('2019-03-19 06:28 AM'),
//         moonPhase: 'Full Moon',
//         maxTempCelsius: 11,
//         maxTempFahrenheiht: 51,
//         minTempCelsius: 3,
//         minTempFahrenheiht: 38
//       }
//     ).then(res => {
//       console.log(res);
//       // expect(res).to.equal(1);
//     });
//   });
//
// });

// describe("ForecastController", () => {
//   before(done => {
//     models.sequelize
//       .sync({ force: true, match: /_test$/, logging: false })
//       .then(() => {
//         done();
//       })
//   });
//
//   describe('getToday()', () => {
//     describe('without `location` parameter', () => {
//       it('should ask for a location if the parameter is left blank');
//     });
//     describe('with `location` parameter', () => {
//       describe('the location exists in the database', () => {
//         it('should fetch the corresponding location reference in the database', async (done) => {
//
//           const seedDb = await models.Location.findOrCreate({
//             where: {
//               areaName: 'Amsterdam',
//               region: 'North Holland',
//               country: 'Netherlands',
//               latitude: '52.379189',
//               longitude: '4.899431'
//             }
//           });
//
//           const locationCount = await models.Location.count();
//           expect(locationCount).to.equal(1);
//
//           const lastLocation = await models.Location.findAll({
//             limit: 1,
//             order: [
//               [ 'createdAt', 'DESC' ]
//             ]
//           }).then(record => {
//             record
//           });
//           //
//           // const findLocation = models.Location.findOne({
//           //   where: {
//           //     areaName: 'Amsterdam'
//           //   }
//           // }).then(location => {
//           //   return location.id;
//           // });
//           // console.log(findLocation.dataValues);
//           // done();
//         });
//       });
//       describe('the location does not exist in the database', () => {
//         it('should create a new location record and return the location reference (ID)');
//       });
//       describe('the forecast for today in the queried location is in the database', () => {
//         it('returns the day forecast');
//       });
//       describe('the forecast for today does not exist in the database', () => {
//         it('should fetch the weather from an external weather service');
//         describe('the external weather service API is not successful', () => {
//           it('should display an error to the user');
//           it('should log the unsuccessful response and recommend changing the service');
//         })
//         describe('the external weather service API is successful', () => {
//           it('should parse the day forecast in a DayForecast model format');
//           it('should parse the three-hourly forecasts in the PeriodicForecast model format');
//         });
//       });
//       it('should see if there are already three-hour forecasts for today in that location');
//     });
//   })
// });

// describe('Forecast', () => {
//
//   it('Location.findOrCreate()', async () => {
//     const req_location = {
//       name: 'Amsterdam',
//       region: 'North Holland',
//       country: 'Netherlands'
//     }
//
//     await models.Location.findOrCreate({
//       where: {
//         areaName: req_location.name
//       },
//       defaults: {
//         region: req_location.region,
//         country: req_location.country
//       }
//     });
//
//     const locationCount = await models.Location.count();
//     expect(locationCount).to.equal(1);
//   });
//
// });
