'use strict';

const models = require('../models');
const moment = require('moment');
const fs = require('fs');
const Sequelize = require('sequelize');
const Op = Sequelize.op;

const axios = require('axios');

exports.getForecast = location => {
  return axios
    .get(`https://api.worldweatheronline.com/premium/v1/weather.ashx`, {
      params: {
        key: process.env.WORLDWEATHERONLINE_API_KEY,
        q: location,
        tp: '3',
        includelocation: 'yes',
        fx24: 'yes',
        format: 'json',
        num_of_days: '2',
        date_format: 'utcDateTime'
      }
    })
    .then(res => res.data)
    .catch(error => console.log(error));
}

const convertedTemperatures = (forecast, metric) => {
  let temperature, temperatureFeelsLike;
  if (metric == 'celsius') {
    temperature = forecast.tempCelsius
    temperatureFeelsLike = forecast.tempFeelsLikeCelsius
  } else {
    temperature = forecast.tempFahrenheit
    temperatureFeelsLike = forecast.tempFeelsLikeFahrenheit
  }
  return [temperature, temperatureFeelsLike];
}

const temperatureDescription = (temperature, temperatureFeelsLike) => {
  if (temperature != temperatureFeelsLike) {
    return `a temperature of ${temperature} degrees. It will feel like ${temperatureFeelsLike}.`
  } else {
    return `a temperature of ${temperature} degrees.`
  }
}

const precipitationDescription = precipitation => {
  let aspects = [];
  if (precipitation.chanceOfWind > 70) aspects.push('wind');
  if (precipitation.chanceOfRain > 70) aspects.push('rain');
  if (precipitation.chanceOfSnow > 70) aspects.push('snow');
  const chances = aspects.join(', ').replace(/,(?=[^,]*$)/, ' and');
  return `There is a high chance of ${chances}`
}

const weatherDescription = description => {
  let sentence = [];
  if (description.includes('possible')) {
    sentence.push('There\'s possibly going to be ');
    sentence.push(description.replace('possible', '').trim().toLowerCase());
  } else {
    sentence.push('It\'s going to be ');
    sentence.push(description.toLowerCase());
  }
  return sentence.join('');
}

exports.forecastToSpeech = (forecast, metric = 'celsius') => {
  const [temperature, temperatureFeelsLike] = convertedTemperatures(forecast, metric);
  return `${weatherDescription(forecast.weatherDescription)} with ${temperatureDescription(temperature, temperatureFeelsLike)} ${precipitationDescription(forecast)}.`
}

exports.parseDayForecast = (forecast, parser = 'worldweatheronline') => {
  if (parser == 'worldweatheronline') {
    const dayForecast = forecast.data.weather[0];
    const date = dayForecast.date;
    return {
      date: new Date(date),
      sunrise: new Date(`${date} ${dayForecast.astronomy[0].sunrise}`),
      sunset: new Date(`${date} ${dayForecast.astronomy[0].sunset}`),
      moonrise: new Date(`${date} ${dayForecast.astronomy[0].moonrise}`),
      moonset: new Date(`${date} ${dayForecast.astronomy[0].moonset}`),
      moonPhase: dayForecast.astronomy[0].moon_phase,
      maxTempCelsius: parseFloat(dayForecast.maxtempC),
      maxTempFahrenheit: parseFloat(dayForecast.maxtempF),
      minTempCelsius: parseFloat(dayForecast.mintempC),
      minTempFahrenheit: parseFloat(dayForecast.mintempF),
    }
  }
}

// location is an Object (name, country, region, latitude, longitude)
exports.findCreateLocation = location => {
  return models.Location.findOrCreate({
    where: {
      areaName: location['name']
    }
  }).then(([location, created]) => {
    return location.id;
  }).catch(error => console.log(error));
};

// location is an Id, day is an Object
exports.findCreateDayForecast = (location, day) => {
  if (!location || !day) throw Error('No location or day Object');
  models.DayForecast.findOne({
    where: {
      location: location,
      date: date
    },
    defaults: {
      // ...day
    }
  }).then(([dayForecast, created]) => {
    console.log(dayForecast.get({
      plain: true
    }))
    console.log(created);
  });
}
//
// exports.findCreateDayForecast = (location, day) => {
//   models.DayForecast.findOrCreate({
//     where: {
//       day: day['date'],
//       location: location
//     },
//     defaults: {
//       day
//     }
//   }).then([dayForecast, created]) => {
//     console.log(dayForecast.get({
//       plain: true
//     }));
//     console.log(created);
//     return dayForecast;
//   };
// }
