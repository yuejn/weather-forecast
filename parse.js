'use strict';

const fs = require('fs');
const moment = require('moment');

// For parsing API data from worldweatheronline.com

// Date must be in format YYYY-MM-DD
// Time must be in format HH:mm A
const convertToDateTime = (date, time) => {
  return moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm A').format();
}

const averageTemperature = temperatures => {
  return temperatures.map(parseFloat).reduce((a, b) => a + b, 0) / temperatures.length;
}

const saveForecast = async () => {
  try {
    fs.readFile('seeders/data/worldweatheronline_2.json', 'utf8', (error, data) => {
      if (error) throw error;
      const forecast = JSON.parse(data);

      // check if the location exists in the database
      // if not, save it and return the ID
      // if yes, return the ID

      // Save the location
      const area = {
        name: forecast.data.nearest_area[0]['areaName'][0]['value'],
        region: forecast.data.nearest_area[0]['region'][0]['value'],
        country: forecast.data.nearest_area[0]['country'][0]['value'],
        latitude: forecast.data.nearest_area[0]['latitude'],
        longitude: forecast.data.nearest_area[0]['longitude'],
      }

      // check if the day forecast exists in the database
      // check if the day forecast hourlies (8 entries)
      // save the day with the location ID above, return the day ID 

      // Save the day forecast
      forecast.data.weather.forEach(day => {
        const date = day.date;
        const dayForecast = {
          date: date,
          sunrise: convertToDateTime(date, day.astronomy[0].sunrise),
          sunset: convertToDateTime(date, day.astronomy[0].sunset),
          moonrise: convertToDateTime(date, day.astronomy[0].moonrise),
          moonset: convertToDateTime(date, day.astronomy[0].moonset),
          moonPhase: day.astronomy[0].moon_phase,
          maxTempCelsius: day.maxtempC,
          maxTempFahrenheiht: day.maxtempF,
          minTempCelsius: day.mintempC,
          minTempFahrenheiht: day.mintempF,
          avgTempCelsius: averageTemperature([day.maxtempC, day.mintempC]),
          avgTempFahrenheit: averageTemperature([day.maxtempF, day.mintempF])
        };

        // remove 2400 entry, use 0000 as start of the day
        day.hourly.shift();

        // save the hourlies, save it to a day


        // Save the three-hourlies
        day.hourly.forEach(periodic => {
          if (periodic.time == '0') periodic.time = '0000';
          const start_time = moment(`${periodic.time}`, 'hmm').format();
          const end_time = moment(start_time).add('3', 'hours').format();

          const periodicForecast = {
            startDate: start_time,
            endDate: end_time,
            tempCelsius: periodic.tempC,
            tempFahrenheit: periodic.tempF,
            tempFeelsLikeCelsius: periodic.FeelsLikeC,
            tempFeelsLikeFahrenheit: periodic.FeelsLikeF,
            windSpeedMiles: periodic.windspeedMiles,
            windSpeedKmph: periodic.windspeedKmph,
            windDegrees: periodic.winddirDegree,
            precipitation: periodic.precipMM,
            chanceOfRain: periodic.chanceofrain,
            chanceOfWind: periodic.chanceofwindy,
            chanceOfSnow: periodic.chanceofsnow,
            weatherIconId: periodic.weatherCode,
            weatherIconUrl: periodic.weatherIconUrl[0].value,
            weatherDescription: periodic.weatherDesc[0].value,
            textToSpeech: periodic.weatherDesc[0].value,
          }

        })
      })
    })
  } catch (error) {
    console.error(error);
  }
}

saveForecast();
