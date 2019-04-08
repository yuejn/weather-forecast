'use strict';

const chai = require('chai');
const expect = chai.expect;

const models = require('../models');
const forecastUtils = require('../helpers').Forecast;
const textUtils = require('../helpers').Text;

const cityTimezones = require('city-timezones');
const moment = require('moment-timezone');

const WEATHER_API = 'worldweatheronline';


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
    expect(location.timezone).to.equal(locationObject.timezone);
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

  it('gets the right date from the location specified', async () => {
    const location = chai.create('location');
    const cityLookup = cityTimezones.findFromCityStateProvince('Shanghai, China');
    const date = moment.tz("2019-04-09 05:35 AM", "YYYY-MM-DD hh:mm A", cityLookup[0].timezone).format();
    expect(date).to.equal("2019-04-09T05:35:00+08:00");
  });

  it('saves the (parsed) hourly forecasts to the specified day forecast', async () => {
    const locationObject = chai.create('location');
    const rawForecastObject = chai.create('rawForecast');

    const cityLookup = cityTimezones.findFromCityStateProvince(`${locationObject.city}, ${locationObject.country}`);
    const timezone = cityLookup[0].timezone;

    const location = await forecastUtils.findCreateLocation(locationObject);
    const dayForecast = forecastUtils.parseDayForecast(rawForecastObject, timezone, WEATHER_API);

    const day = await forecastUtils.findCreateDayForecast(location, dayForecast);

    expect(day).to.be.ok;

    let parsedPeriodics = [];
    dayForecast.periodics.forEach(periodicForecast => {
      parsedPeriodics.push(forecastUtils.parsePeriodicForecast(day, periodicForecast, timezone, WEATHER_API));
    });
    const periodics = await forecastUtils.importPeriodicForecasts(parsedPeriodics);
    let forecast = await forecastUtils.findForecast(location, day.date);

    expect(typeof forecast).to.equal('object');
    expect(typeof forecast.Location).to.equal('object');
  });
});

describe('fetching and parsing forecast information from worldweatheronline.com', () => {
  it('fetches the forecast', async () => {
    const rawForecast = await forecastUtils.getForecast('Amsterdam, Netherlands')
    expect(typeof rawForecast.data).to.equal('object');
  });

  it('pulls out and parse the day forecast', async () => {
    const rawForecast = await forecastUtils.getForecast('Amsterdam, Netherlands', '2019-03-18')
    const parsedForecast = forecastUtils.parseDayForecast(rawForecast, 'Europe/Amsterdam', WEATHER_API);
    expect(typeof parsedForecast).to.equal('object');
    expect(typeof parsedForecast.date).to.equal('string');
    expect(typeof parsedForecast.sunrise).to.equal('string');
    expect(typeof parsedForecast.sunset).to.equal('string');
    expect(typeof parsedForecast.maxTempCelsius).to.equal('number');
    expect(typeof parsedForecast.maxTempFahrenheit).to.equal('number');
    expect(typeof parsedForecast.minTempCelsius).to.equal('number');
    expect(typeof parsedForecast.minTempFahrenheit).to.equal('number');
    expect(typeof parsedForecast.periodics).to.equal('object');
    expect(parsedForecast.periodics.length).to.equal(8);
  });

  it('pulls out and parse the hourly forecasts', async () => {
    const rawForecast = await forecastUtils.getForecast('Amsterdam, Netherlands');
    const dayForecast = forecastUtils.parseDayForecast(rawForecast, 'Europe/Amsterdam', WEATHER_API);
    const day = { id: 1, date: dayForecast.date }
    let periodics = [];

    dayForecast.periodics.forEach(periodicForecast => {
      periodics.push(forecastUtils.parsePeriodicForecast(day, periodicForecast, 'Europe/Amsterdam', WEATHER_API));
    });

    expect(periodics.length).to.equal(8);

    expect(typeof periodics[0]).to.equal('object');
    expect(typeof periodics[0].DayForecastId).to.equal('number');
    expect(typeof periodics[0].startDate).to.equal('string');
    expect(typeof periodics[0].endDate).to.equal('string');
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
