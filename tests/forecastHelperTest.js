'use strict';

const models = require('../models');
const helpers = require('../helpers');
const chai = require('chai');
const expect = chai.expect;

describe('forecastToSpeech()', () => {
  describe('when there\'s a high chance of rain, snow, or wind', () => {
    it('builds the phrase with [there is a high chance...]', () => {
      const input = {
        tempCelsius: 4,
        tempFeelsLikeCelsius: 1,
        weatherDescription: 'Partly cloudly',
        chanceOfRain: 84
      }
      const result = helpers.forecastToSpeech(input);
      expect(result).to.equal('It\'s going to be partly cloudly with a temperature of 4 degrees. It will feel like 1. There is a high chance of rain.');
    });
  });

  describe('when there\'s not a high chance of rain, snow, or wind', () => {
    it('builds the phrase', () => {
      const input = {
        tempCelsius: 4,
        tempFeelsLikeCelsius: 1,
        weatherDescription: 'Partly cloudly',
      }
      const result = helpers.forecastToSpeech(input);
      expect(result).to.equal('It\'s going to be partly cloudly with a temperature of 4 degrees. It will feel like 1.');
    });
  });
});


describe('findCreateDayForecast()', () => {
  it('throws an error without a locationId argument', () => {
    expect(() => {
      helpers.findCreateDayForecast()
    }).to.throw('No locationId');
  });

  it('throws an error without a parsedDay argument', () => {
    expect(() => {
      helpers.findCreateDayForecast(1)
    }).to.throw('No day object');
  });

  it('saves a day forecast', async () => {
    const location = chai.create('location');
    const dayForecast = chai.create('dayForecast');

    await models.Location.create({ location });
    const locationCount = await models.Location.count();
    expect(locationCount).to.equal(1);

    await models.DayForecast.create({ dayForecast });
    const dayForecastCount = await models.DayForecast.count();
    expect(dayForecastCount).to.equal(1);
  });

  it('saves the hourly forecasts', async () => {
    const location = chai.create('location');
    const dayForecast = chai.create('dayForecast');

    await models.Location.create({ location });
    const locationCount = await models.Location.count();
    expect(locationCount).to.equal(1);

    await models.DayForecast.create({ dayForecast });
    const dayForecastCount = await models.DayForecast.count();
    expect(dayForecastCount).to.equal(1);

    let periodics = [];
    for(let i = 0; i < 8; i++) {
      const startDate = new Date(2019,2,19,(i * 3),0,0,0);
      const endDate = new Date(2019,2,19,(i * 3 + 3),0,0,0);
      periodics.push(
        chai.create('periodicForecast', {
          startDate: startDate,
          endDate: endDate,
          DayId: 1
        })
      );
    }

    const periodicForecasts = await models.PeriodicForecast.bulkCreate(
      periodics,
      { returning: true }
    );
    expect(periodicForecasts.length).to.equal(8);
  });

  describe('with mock data', () => {
    it('returns day/hourly forecast from the database', async () => {
      const location = await models.Location.create( { city: 'Amsterdam', country: 'Netherlands' });
      const rawForecast = await helpers.getForecast('Amsterdam, Netherlands');
      const dayForecast = helpers.parseDayForecast(rawForecast, 'worldweatheronline');
      const day = await models.DayForecast.create({
        LocationId: location.id,
        ...dayForecast
      });

      expect(typeof day).to.equal('object');

      let periodics = [];
      dayForecast.periodics.forEach(periodicForecast => {
        periodics.push(
          helpers.parsePeriodicForecast(day.date, day.id, periodicForecast, 'worldweatheronline')
        )
      });

      const periodicForecasts = await models.PeriodicForecast.bulkCreate(
        periodics,
        { returning: true }
      );

      expect(periodicForecasts.length).to.equal(8);

      const getForecasts = await models.PeriodicForecast.findAll({
        include: [{
          model: models.DayForecast,
          required: true,
          where: {
            date: '2019-03-19'
          },
          include: [{
            model: models.Location,
            required: true,
            where: {
              id: 1
            }
          }]
        }]
      });

      expect(getForecasts.length).to.equal(8);
    })
  });

});

describe('fetching and parsing forecast information from worldweatheronline.com', () => {
  it('fetches the forecast', async () => {
    const rawForecast = await helpers.getForecast('Amsterdam, Netherlands')
    expect(typeof rawForecast.data).to.equal('object');
  });
  it('pulls out and parse the day forecast', async () => {
    const rawForecast = await helpers.getForecast('Amsterdam, Netherlands')
    const parsedForecast = helpers.parseDayForecast(rawForecast, 'worldweatheronline');
    expect(typeof parsedForecast).to.equal('object');
    expect(typeof parsedForecast.date).to.equal('object');
    expect(typeof parsedForecast.sunrise).to.equal('object');
    expect(typeof parsedForecast.sunset).to.equal('object');
    expect(typeof parsedForecast.maxTempCelsius).to.equal('number');
    expect(typeof parsedForecast.maxTempFahrenheit).to.equal('number');
    expect(typeof parsedForecast.minTempCelsius).to.equal('number');
    expect(typeof parsedForecast.minTempFahrenheit).to.equal('number');
    expect(typeof parsedForecast.periodics).to.equal('object');
    expect(parsedForecast.periodics.length).to.equal(8);
  });
  it('pulls out and parse the hourly forecasts', async () => {
    const rawForecast = await helpers.getForecast('Amsterdam, Netherlands');
    const dayForecast = helpers.parseDayForecast(rawForecast, 'worldweatheronline');

    let periodics = [];

    dayForecast.periodics.forEach(periodicForecast => {
      periodics.push(helpers.parsePeriodicForecast(new Date('2019-03-19'), 1, periodicForecast, 'worldweatheronline'));
    });

    expect(periodics.length).to.equal(8);
    expect(periodics[0].startDate.getTime()).to.equal(Date.UTC(2019,2,19,0,0,0,0))
    expect(periodics[1].startDate.getTime()).to.equal(Date.UTC(2019,2,19,3,0,0))
    expect(periodics[2].startDate.getTime()).to.equal(Date.UTC(2019,2,19,6,0,0))
    expect(periodics[3].startDate.getTime()).to.equal(Date.UTC(2019,2,19,9,0,0))
    expect(periodics[4].startDate.getTime()).to.equal(Date.UTC(2019,2,19,12))
    expect(periodics[5].startDate.getTime()).to.equal(Date.UTC(2019,2,19,15))
    expect(periodics[6].startDate.getTime()).to.equal(Date.UTC(2019,2,19,18))
    expect(periodics[7].startDate.getTime()).to.equal(Date.UTC(2019,2,19,21))

    expect(typeof periodics[0]).to.equal('object');
    expect(typeof periodics[0].DayForecastId).to.equal('number');
    expect(typeof periodics[0].startDate).to.equal('object');
    expect(typeof periodics[0].endDate).to.equal('object');
    expect(typeof periodics[0].tempCelsius).to.equal('number');
    expect(typeof periodics[0].tempFahrenheit).to.equal('number');
    expect(typeof periodics[0].tempFeelsLikeCelsius).to.equal('number');
    expect(typeof periodics[0].tempFeelsLikeFahrenheit).to.equal('number');
    expect(typeof periodics[0].windSpeedMiles).to.equal('number');
    expect(typeof periodics[0].windSpeedKmph).to.equal('number');
    expect(typeof periodics[0].windDegrees).to.equal('number');
    expect(typeof periodics[0].precipitation).to.equal('number');
    expect(typeof periodics[0].chanceOfRain).to.equal('number');
    expect(typeof periodics[0].chanceOfWind).to.equal('number');
    expect(typeof periodics[0].chanceOfSnow).to.equal('number');
    expect(typeof periodics[0].weatherIconId).to.equal('string');
    expect(typeof periodics[0].weatherIconUrl).to.equal('string');
    expect(typeof periodics[0].weatherDescription).to.equal('string');
    expect(typeof periodics[0].textToSpeech).to.equal('string');
  });
});
