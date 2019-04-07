'use strict';

exports.convertToDate = date => {
  return(new Date(date).toISOString().split('T')[0]);
}

exports.convertedTemperatures = (forecast, metric) => {
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

exports.temperatureDescription = (temperature, temperatureFeelsLike) => {
  if (temperature != temperatureFeelsLike) {
    return `a temperature of ${temperature} degrees. It will feel like ${temperatureFeelsLike}.`
  } else {
    return `a temperature of ${temperature} degrees.`
  }
}

exports.precipitationDescription = (precipitation, percentage = 65) => {
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

exports.weatherDescription = description => {
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
  const [temperature, temperatureFeelsLike] = this.convertedTemperatures(forecast, metric);
  return `${this.weatherDescription(forecast.weatherDescription)} with ${this.temperatureDescription(temperature, temperatureFeelsLike)} ${this.precipitationDescription(forecast)}`.trim();
}
