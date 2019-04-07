'use strict';

const models = require('../models');
const forecastUtils = require('../helpers').Forecast;
const textUtils = require('../helpers').Text;
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
      const result = textUtils.forecastToSpeech(input);
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
      const result = textUtils.forecastToSpeech(input);
      expect(result).to.equal('It\'s going to be partly cloudly with a temperature of 4 degrees. It will feel like 1.');
    });
  });
});


describe('findCreateLocation()', () => {
  it('saves and returns a location', async () => {
    const locationObject = chai.create('location');
    const location = await forecastUtils.findCreateLocation(locationObject);
    expect(location).to.be.ok;
    expect(location.id).to.equal(1);
    expect(location.city).to.equal(locationObject.city);
    expect(location.country).to.equal(locationObject.country);
  });
});

describe('findCreateDayForecast()', () => {
  it('throws an error without a location argument', () => {
    expect(() => {
      forecastUtils.findCreateDayForecast()
    }).to.throw('No location');
  });

  it('throws an error without a day argument', () => {
    expect(() => {
      forecastUtils.findCreateDayForecast(1)
    }).to.throw('No day object');
  });

  it('saves a (parsed) day forecast', async () => {
    const locationObject = chai.create('location');
    const dayForecastObject = chai.create('dayForecast');

    const location = await forecastUtils.findCreateLocation(locationObject);
    const dayForecast = await forecastUtils.findCreateDayForecast(location, dayForecastObject);
    expect(typeof dayForecast).to.equal('object');
  });

  it('saves the (parsed) hourly forecasts to the specified day forecast', async () => {
    const locationObject = chai.create('location');
    const rawForecastObject = chai.create('rawForecast');

    const location = await forecastUtils.findCreateLocation(locationObject);
    const dayForecast = forecastUtils.parseDayForecast(rawForecastObject, 'worldweatheronline');

    const day = await forecastUtils.findCreateDayForecast(location, dayForecast);

    expect(day).to.be.ok;

    let parsedPeriodics = [];
    dayForecast.periodics.forEach(periodicForecast => {
      parsedPeriodics.push(forecastUtils.parsePeriodicForecast(day, periodicForecast, 'worldweatheronline'));
    });

    const periodics = await forecastUtils.importPeriodicForecasts(parsedPeriodics);
    const forecast = await forecastUtils.findForecast(location, day.date);

    expect(typeof forecast).to.equal('object');
    expect(typeof forecast.location).to.equal('object');
  });

  it('returns the requested forecast');

});

describe('fetching and parsing forecast information from worldweatheronline.com', () => {
  it('fetches the forecast', async () => {
    const rawForecast = await forecastUtils.getForecast('Amsterdam, Netherlands')
    expect(typeof rawForecast.data).to.equal('object');
  });
  it('pulls out and parse the day forecast', async () => {
    const rawForecast = await forecastUtils.getForecast('Amsterdam, Netherlands')
    const parsedForecast = forecastUtils.parseDayForecast(rawForecast, 'worldweatheronline');
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
    const rawForecast = await forecastUtils.getForecast('Amsterdam, Netherlands');
    const dayForecast = forecastUtils.parseDayForecast(rawForecast, 'worldweatheronline');
    const day = { id: 1, date: dayForecast.date }
    let periodics = [];

    dayForecast.periodics.forEach(periodicForecast => {
      periodics.push(forecastUtils.parsePeriodicForecast(day, periodicForecast, 'worldweatheronline'));
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
