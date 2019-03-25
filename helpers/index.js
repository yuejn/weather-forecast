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

const precipitationDescription = (precipitation, percentage = 65) => {
  if (precipitation.chanceOfWind > percentage || precipitation.chanceOfRain > percentage || precipitation.chanceOfSnow > percentage) {
    let aspects = [];
    if (precipitation.chanceOfWind > percentage) aspects.push('wind');
    if (precipitation.chanceOfRain > percentage) aspects.push('rain');
    if (precipitation.chanceOfSnow > percentage) aspects.push('snow');
    const chances = aspects.join(', ').replace(/,(?=[^,]*$)/, ' and');
    return `There is a high chance of ${chances}.`;
  } else {
    return '';
  }
}

const weatherDescription = description => {
  let sentence = [];
  if (description && description.includes('possible')) {
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
  return `${weatherDescription(forecast.weatherDescription)} with ${temperatureDescription(temperature, temperatureFeelsLike)} ${precipitationDescription(forecast)}`.trim();
}

exports.parseDayForecast = (forecast, parser = 'worldweatheronline') => {
  if (parser == 'worldweatheronline') {
    const dayForecast = forecast.data.weather[0];
    const date = dayForecast.date;

    // remove the 2400 entry, use 0000 as start of the day
    dayForecast.hourly.shift();
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
      periodics: dayForecast.hourly
    }
  }
}

exports.parsePeriodicForecast = (date, dayId, periodic, parser = 'worldweatheronline') => {
  if (parser == 'worldweatheronline') {
    if (periodic.time == '0') periodic.time = '000';

    const startingHour = parseInt(periodic.time.slice(0, -2));
    const startTime = new Date(date.setUTCHours(startingHour));
    const endTime = new Date(date.setUTCHours(startingHour + 3));

    const textToSpeech = this.forecastToSpeech({
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
      DayForecastId: parseInt(dayId),
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

// location is an Object (name, country, region, latitude, longitude)
exports.findCreateLocation = location => {
  return models.Location.findOrCreate({
    limit: 1,
    where: {
      city: location['name']
    }
  }).then(([location]) => {
    return location;
  }).catch(err => {
    console.log('Location', err)
  });
};

exports.findCreateDayForecast = (locationId, parsedDay) => {
  if (!locationId) throw Error('No locationId');
  if (!parsedDay) throw Error('No day object');
  return models.DayForecast.findOrCreate({
    where: {
      LocationId: locationId,
      date: parsedDay.date
    },
    defaults: {
      ...parsedDay
    }
  }).then(([dayForecast]) => {
    return dayForecast;
  }).catch(err => console.log('DayForecast:', err) );
};
