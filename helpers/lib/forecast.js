'use strict';

require('dotenv').config();
const models = require('../../models');
const sequelize = require('sequelize');
const axios = require('axios');

const textUtils = require('./text');

exports.getForecast = (location, date = new Date()) => {
  date = textUtils.convertToDate(date);
  return axios
    .get(`https://api.worldweatheronline.com/premium/v1/weather.ashx`, {
      params: {
        key: process.env.WORLDWEATHERONLINE_API_KEY,
        q: location,
        date: date,
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
      return [error.response.status, error.response.statusText]
    })
};

exports.parseDayForecast = (forecast, parser = 'worldweatheronline') => {
  if (!forecast) throw Error('Oops! Something went wrong with fetching the weather.');
  if (parser == 'worldweatheronline') {
    const dayForecast = forecast.data.weather[0];
    const date = dayForecast.date;

    // remove the 2400 entry, use 0000 as start of the day
    dayForecast.hourly.shift();
    return {
      date: new Date(date),
      sunrise: new Date(`${date} ${dayForecast.astronomy[0].sunrise}`),
      sunset: new Date(`${date} ${dayForecast.astronomy[0].sunset}`),
      maxTempCelsius: parseFloat(dayForecast.maxtempC),
      maxTempFahrenheit: parseFloat(dayForecast.maxtempF),
      minTempCelsius: parseFloat(dayForecast.mintempC),
      minTempFahrenheit: parseFloat(dayForecast.mintempF),
      periodics: dayForecast.hourly
    }
  }
}

exports.parsePeriodicForecast = (day, periodic, parser = 'worldweatheronline') => {
  if (parser == 'worldweatheronline') {
    if (periodic.time == '0') periodic.time = '000';

    const startingHour = parseInt(periodic.time.slice(0, -2));
    const startTime = new Date(day.date.setUTCHours(startingHour));
    const endTime = new Date(day.date.setUTCHours(startingHour + 3));

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
      textToSpeech: textToSpeech
    }
  }
}

// location is an Object (city, country, latitude, longitude)
exports.findCreateLocation = location => {
  return models.Location.findOrCreate({
    limit: 1,
    where: {
      city: location.city,
      country: location.country
    },
    defaults: {
      ...location
    }
  }).then(([location]) => location)
    .catch(err => console.log(err));
};

exports.findForecast = (location, date) => {
  if (!location) throw Error('No location object provided');
  if (!date) throw Error('No date provided');
  return models.DayForecast.findAll({
    where: {
      LocationId: location.id,
      date: date
    },
    attributes: {
      exclude: ['id', 'LocationId', 'createdAt', 'updatedAt']
    },
    include: [{
      model: models.Location,
      required: true,
      attributes: {
        exclude: ['id', 'createdAt', 'updatedAt']
      }
    }, {
      model: models.PeriodicForecast,
      required: true,
      attributes: {
        exclude: ['id', 'createdAt', 'updatedAt', 'DayForecastId']
      }
    }]
  }).then(([forecast]) => forecast)
  .catch(err => console.log('findForecast: ', err))
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

exports.findCreateDayForecast = (location, day) => {
  if (!location) throw Error('No location object provided');
  if (!day) throw Error('No day object provided');

  return models.DayForecast.findOrCreate({
    where: {
      LocationId: location.id,
      date: day.date
    },
    defaults: {
      ...day
    }
  }).then(([forecast]) => forecast)
  .catch(err => console.log('findCreateDayForecast: ', err))
}

exports.importPeriodicForecasts = periodics => {
  if (!periodics) throw Error('No periodics object provided');
  return models.PeriodicForecast.bulkCreate(
    periodics,
    { returning: true }
  ).catch(err => console.log('importPeriodicForecasts: ', err))
}
