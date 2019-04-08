require('dotenv').config();

const models = require('../../models');
const sequelize = require('sequelize');
const axios = require('axios');
const cityTimezones = require('city-timezones');
const moment = require('moment-timezone');

const textUtils = require('./text');

exports.getForecast = (location, date, parser = 'worldweatheronline') => {
  switch (parser) {
  case 'worldweatheronline':
    return axios
      .get('https://api.worldweatheronline.com/premium/v1/weather.ashx', {
        params: {
          key: process.env.WORLDWEATHERONLINE_API_KEY,
          q: location,
          date,
          tp: '3',
          includelocation: 'yes',
          fx24: 'yes',
          format: 'json',
          num_of_days: '1',
          date_format: 'utcDateTime'
        }
      })
      .then(res => res.data)
      .catch(error => {
        console.log(error);
        throw Error (`[${error.response.status }] ${error.response.statusText }`);
      });
  break;
  default:
    console.log('`parser` not specified.');
    return false;
  }
};

exports.parseDayForecast = (forecast, timezone, parser = 'worldweatheronline') => {
  if (!forecast) throw Error('Oops! Something went wrong with fetching the weather.');
  switch (parser) {
  case 'worldweatheronline':
    const dayForecast = forecast.data.weather[0];
    const date = dayForecast.date;

    // remove the 2400 entry, use 0000 as start of the day
    dayForecast.hourly.shift();

    return {
      date: moment.tz(date, 'YYYY-MM-DD', timezone).format(),
      sunrise: moment.tz(`${date} ${dayForecast.astronomy[0].sunrise}`, 'YYYY-MM-DD hh:mm A', timezone).format(),
      sunset: moment.tz(`${date} ${dayForecast.astronomy[0].sunset}`, 'YYYY-MM-DD hh:mm A', timezone).format(),
      maxTempCelsius: parseFloat(dayForecast.maxtempC),
      maxTempFahrenheit: parseFloat(dayForecast.maxtempF),
      minTempCelsius: parseFloat(dayForecast.mintempC),
      minTempFahrenheit: parseFloat(dayForecast.mintempF),
      periodics: dayForecast.hourly
    }
  break;
  default:
    console.log('`parser` not specified');
    return false;
  }
}

exports.parsePeriodicForecast = (day, periodic, timezone, parser = 'worldweatheronline') => {
  if (!day) throw Error('Oops! Something went wrong with fetching the day forecast.');
  if (!periodic) throw Error('Oops! Something went wrong with fetching the periodic forecast.');

  switch (parser) {
  case 'worldweatheronline':
    if (periodic.time === '0') periodic.time = '000';

    // const zone = moment.tz.zone(day.Location.timezone);

    const startingHour = parseInt(periodic.time.slice(0, -2));
    const startTime = moment.tz(day.date, 'YYYY-mm-dd', timezone).hours(startingHour).format();
    const endTime = moment.tz(day.date, 'YYYY-mm-dd', timezone).hours(startingHour + 3).format();

    const textToSpeech = textUtils.forecastToSpeech({
      tempCelsius: parseFloat(periodic.tempC),
      tempFahrenheit: parseFloat(periodic.tempF),
      tempFeelsLikeCelsius: parseFloat(periodic.FeelsLikeC),
      tempFeelsLikeFahrenheit: parseFloat(periodic.FeelsLikeF),
      weatherDescription: periodic.weatherDesc[0].value,
      chanceOfRain: parseInt(periodic.chanceofrain),
      chanceOfWind: parseInt(periodic.chanceofwindy),
      chanceOfSnow: parseInt(periodic.chanceofsnow)
    });

    return {
      DayForecastId: parseInt(day.id),
      startDate: startTime,
      endDate: endTime,
      tempCelsius: parseFloat(periodic.tempC),
      tempFahrenheit: parseFloat(periodic.tempF),
      tempFeelsLikeCelsius: parseFloat(periodic.FeelsLikeC),
      tempFeelsLikeFahrenheit: parseFloat(periodic.FeelsLikeF),
      windSpeedMiles: parseInt(periodic.windspeedMiles),
      windSpeedKmph: parseInt(periodic.windspeedKmph),
      windDegrees: parseInt(periodic.winddirDegree),
      precipitation: parseFloat(periodic.precipMM),
      chanceOfRain: parseInt(periodic.chanceofrain),
      chanceOfWind: parseInt(periodic.chanceofwindy),
      chanceOfSnow: parseInt(periodic.chanceofsnow),
      weatherIconId: periodic.weatherCode,
      weatherIconUrl: periodic.weatherIconUrl[0].value,
      weatherDescription: periodic.weatherDesc[0].value,
      textToSpeech
    }
  break;
  default:
    console.log('`parser not specified.`');
    return false;
  }
}

// location is an Object (city, country, latitude, longitude)
exports.findCreateLocation = (location) => {
  return models.Location.findOrCreate({
    limit: 1,
    where: {
      city: location.city,
      country: location.country
    },
    defaults: {
      ...location
    }
  }).then(([ location ]) => location)
    .catch(err => console.log(err));
};

exports.findForecast = (location, date) => {
  if (!location) throw Error('No location object provided');
  if (!date) throw Error('No date provided');

  return models.DayForecast.findAll({
    where: {
      LocationId: location.id,
      date
    },
    attributes: {
      exclude: [ 'id', 'LocationId', 'createdAt', 'updatedAt' ]
    },
    include: [
      {
        model: models.Location,
        required: true,
        attributes: {
          exclude: [ 'id', 'createdAt', 'updatedAt' ]
        }
      }, {
        model: models.PeriodicForecast,
        required: true,
        attributes: {
          exclude: [ 'id', 'createdAt', 'updatedAt', 'DayForecastId' ]
        }
      }
    ]
  })
  .map((data) => data.get({ plain: true }))
  .then(([ forecast ]) => {
    if (typeof forecast !== 'undefined') {
      forecast.date = moment.utc(forecast.date).tz(forecast.Location.timezone).format();
      forecast.sunrise = moment.utc(forecast.sunrise).tz(forecast.Location.timezone).format();
      forecast.sunset = moment.utc(forecast.sunset).tz(forecast.Location.timezone).format();
      forecast.PeriodicForecasts.forEach((periodic, i) => {
        forecast.PeriodicForecasts[i].startDate = moment.utc(periodic.startDate).tz(forecast.Location.timezone).format();
        forecast.PeriodicForecasts[i].endDate = moment.utc(periodic.endDate).tz(forecast.Location.timezone).format();
      });
    }
    return forecast;
  })
  .catch(err => console.log('findForecast: ', err))
}

exports.findCreateDayForecast = (location, day) => {
  if (!location) throw Error('No location object provided');
  if (!day) throw Error('No day object provided');

  return models.DayForecast.findOrCreate({
    where: {
      LocationId: location.id,
      date: day.date
    },
    include: [ models.PeriodicForecast ],
    defaults: {
      ...day
    }
  }).then(([ forecast ]) => forecast)
  .catch(err => console.log('findCreateDayForecast: ', err))
}

exports.importPeriodicForecasts = (periodics) => {
  if (!periodics) throw Error('No periodics object provided');

  return models.PeriodicForecast.bulkCreate(
    periodics,
    { returning: true }
  ).catch(err => console.log('importPeriodicForecasts: ', err))
}

// If a location is missing lng/lat coordinates, we can update it here
exports.updateLocationCoordinates = (location, coordinates) => {
  return models.Location.update(
    {
      longitude: coordinates.longitude,
      latitude: coordinates.latitude
    },
    {
      where: {
        id: location.id
      }
    }
  ).then(count => console.log(`Updated coordinates for location #${location.id} (#${location.city}, ${location.country}).`));
}

// If a location is missing a timezone, we can update it here
exports.updateLocationTimezone = (location, timezone) => {
  return models.Location.update(
    {
      timezone
    },
    {
      where: {
        id: location.id
      }
    }
  ).then(count => console.log(`Updated timezone for location #${location.id} (#${location.city}, ${location.country}).`));
}
