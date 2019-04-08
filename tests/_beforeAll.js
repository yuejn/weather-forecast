'use strict';
const nock = require('nock');
const chai = require('chai');
const models = require('../models');
const factories = require('chai-factories');
chai.use(factories);

// Mock responses
const worldweatheronlineResponse = require('./responses/worldweatheronline.json');

// Truncate the database
beforeEach(done => {
  models.sequelize
    .sync({
      force: true,
      match: /_test$/,
      logging: false
    })
    .then(() => {
      done();
    });
});

// Replace API calls with mock data
beforeEach(() => {
  nock('https://api.worldweatheronline.com')
    .get('/premium/v1/weather.ashx')
    .query(true)
    .reply(200, worldweatheronlineResponse);
});

// Factories

chai.factory('dayForecast', {
  date: '2019-03-18',
  sunrise: '2019-03-18 06:48',
  sunset: '2019-03-18 18:49',
  maxTempCelsius: 9,
  maxTempFahrenheit: 48,
  minTempCelsius: 5,
  minTempFahrenheit: 40,
});

chai.factory('location', {
  city: 'Amsterdam',
  country: 'Netherlands',
  latitude: '52.370216',
  longitude: '4.895168',
  timezone: 'Europe/Amsterdam'
});


chai.factory('rawForecast', {
  "data": {
    "nearest_area": [
        {
            "city": [
                {
                    "value": "Amsterdam"
                }
            ],
            "country": [
                {
                    "value": "Netherlands"
                }
            ],
            "region": [
                {
                    "value": "North Holland"
                }
            ],
            "latitude": "52.374",
            "longitude": "4.890"
        }
    ],
    "weather": [
      {
        "date": "2019-03-18",
        "astronomy": [
            {
                "sunrise": "06:48 AM",
                "sunset": "06:49 PM",
                "moonrise": "03:14 PM",
                "moonset": "05:55 AM",
                "moon_phase": "Full Moon",
                "moon_illumination": "98"
            }
        ],
        "maxtempC": "9",
        "maxtempF": "47",
        "mintempC": "5",
        "mintempF": "40",
        "totalSnow_cm": "0.0",
        "sunHour": "3.3",
        "uvIndex": "2",
        "hourly": [
            {
                "time": "24",
                "tempC": "9",
                "tempF": "47",
                "windspeedMiles": "10",
                "windspeedKmph": "16",
                "winddirDegree": "300",
                "winddir16Point": "WNW",
                "weatherCode": "176",
                "weatherIconUrl": [
                    {
                        "value": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png"
                    }
                ],
                "weatherDesc": [
                    {
                        "value": "Patchy rain possible"
                    }
                ],
                "precipMM": "2.6",
                "humidity": "68",
                "visibility": "16",
                "pressure": "1017",
                "cloudcover": "56",
                "HeatIndexC": "6",
                "HeatIndexF": "44",
                "DewPointC": "1",
                "DewPointF": "33",
                "WindChillC": "4",
                "WindChillF": "38",
                "WindGustMiles": "15",
                "WindGustKmph": "25",
                "FeelsLikeC": "4",
                "FeelsLikeF": "38",
                "chanceofrain": "99",
                "chanceofremdry": "0",
                "chanceofwindy": "0",
                "chanceofovercast": "82",
                "chanceofsunshine": "18",
                "chanceoffrost": "0",
                "chanceofhightemp": "0",
                "chanceoffog": "0",
                "chanceofsnow": "0",
                "chanceofthunder": "0",
                "uvIndex": "2"
            },
            {
                "time": "0",
                "tempC": "6",
                "tempF": "43",
                "windspeedMiles": "12",
                "windspeedKmph": "19",
                "winddirDegree": "278",
                "winddir16Point": "W",
                "weatherCode": "119",
                "weatherIconUrl": [
                    {
                        "value": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png"
                    }
                ],
                "weatherDesc": [
                    {
                        "value": "Cloudy"
                    }
                ],
                "precipMM": "1.3",
                "humidity": "75",
                "visibility": "10",
                "pressure": "1008",
                "cloudcover": "75",
                "HeatIndexC": "6",
                "HeatIndexF": "43",
                "DewPointC": "2",
                "DewPointF": "35",
                "WindChillC": "2",
                "WindChillF": "36",
                "WindGustMiles": "20",
                "WindGustKmph": "32",
                "FeelsLikeC": "2",
                "FeelsLikeF": "36",
                "chanceofrain": "59",
                "chanceofremdry": "29",
                "chanceofwindy": "0",
                "chanceofovercast": "86",
                "chanceofsunshine": "5",
                "chanceoffrost": "0",
                "chanceofhightemp": "0",
                "chanceoffog": "0",
                "chanceofsnow": "0",
                "chanceofthunder": "0",
                "uvIndex": "2"
            },
            {
                "time": "300",
                "tempC": "5",
                "tempF": "41",
                "windspeedMiles": "11",
                "windspeedKmph": "18",
                "winddirDegree": "296",
                "winddir16Point": "WNW",
                "weatherCode": "386",
                "weatherIconUrl": [
                    {
                        "value": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0032_thundery_showers_night.png"
                    }
                ],
                "weatherDesc": [
                    {
                        "value": "Patchy light rain with thunder"
                    }
                ],
                "precipMM": "0.7",
                "humidity": "75",
                "visibility": "15",
                "pressure": "1010",
                "cloudcover": "72",
                "HeatIndexC": "5",
                "HeatIndexF": "41",
                "DewPointC": "1",
                "DewPointF": "34",
                "WindChillC": "2",
                "WindChillF": "35",
                "WindGustMiles": "20",
                "WindGustKmph": "32",
                "FeelsLikeC": "2",
                "FeelsLikeF": "35",
                "chanceofrain": "76",
                "chanceofremdry": "0",
                "chanceofwindy": "0",
                "chanceofovercast": "83",
                "chanceofsunshine": "0",
                "chanceoffrost": "0",
                "chanceofhightemp": "0",
                "chanceoffog": "0",
                "chanceofsnow": "0",
                "chanceofthunder": "0",
                "uvIndex": "2"
            },
            {
                "time": "600",
                "tempC": "5",
                "tempF": "41",
                "windspeedMiles": "11",
                "windspeedKmph": "18",
                "winddirDegree": "304",
                "winddir16Point": "WNW",
                "weatherCode": "176",
                "weatherIconUrl": [
                    {
                        "value": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0025_light_rain_showers_night.png"
                    }
                ],
                "weatherDesc": [
                    {
                        "value": "Patchy rain possible"
                    }
                ],
                "precipMM": "0.2",
                "humidity": "73",
                "visibility": "17",
                "pressure": "1013",
                "cloudcover": "72",
                "HeatIndexC": "5",
                "HeatIndexF": "41",
                "DewPointC": "0",
                "DewPointF": "33",
                "WindChillC": "1",
                "WindChillF": "34",
                "WindGustMiles": "20",
                "WindGustKmph": "32",
                "FeelsLikeC": "1",
                "FeelsLikeF": "34",
                "chanceofrain": "73",
                "chanceofremdry": "0",
                "chanceofwindy": "0",
                "chanceofovercast": "89",
                "chanceofsunshine": "0",
                "chanceoffrost": "0",
                "chanceofhightemp": "0",
                "chanceoffog": "0",
                "chanceofsnow": "0",
                "chanceofthunder": "0",
                "uvIndex": "1"
            },
            {
                "time": "900",
                "tempC": "7",
                "tempF": "44",
                "windspeedMiles": "13",
                "windspeedKmph": "21",
                "winddirDegree": "301",
                "winddir16Point": "WNW",
                "weatherCode": "176",
                "weatherIconUrl": [
                    {
                        "value": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png"
                    }
                ],
                "weatherDesc": [
                    {
                        "value": "Patchy rain possible"
                    }
                ],
                "precipMM": "0.2",
                "humidity": "62",
                "visibility": "17",
                "pressure": "1016",
                "cloudcover": "81",
                "HeatIndexC": "7",
                "HeatIndexF": "44",
                "DewPointC": "0",
                "DewPointF": "32",
                "WindChillC": "3",
                "WindChillF": "37",
                "WindGustMiles": "19",
                "WindGustKmph": "31",
                "FeelsLikeC": "3",
                "FeelsLikeF": "37",
                "chanceofrain": "91",
                "chanceofremdry": "0",
                "chanceofwindy": "0",
                "chanceofovercast": "92",
                "chanceofsunshine": "0",
                "chanceoffrost": "0",
                "chanceofhightemp": "0",
                "chanceoffog": "0",
                "chanceofsnow": "0",
                "chanceofthunder": "0",
                "uvIndex": "2"
            },
            {
                "time": "1200",
                "tempC": "8",
                "tempF": "47",
                "windspeedMiles": "13",
                "windspeedKmph": "21",
                "winddirDegree": "300",
                "winddir16Point": "WNW",
                "weatherCode": "176",
                "weatherIconUrl": [
                    {
                        "value": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png"
                    }
                ],
                "weatherDesc": [
                    {
                        "value": "Patchy rain possible"
                    }
                ],
                "precipMM": "0.0",
                "humidity": "54",
                "visibility": "16",
                "pressure": "1018",
                "cloudcover": "73",
                "HeatIndexC": "8",
                "HeatIndexF": "47",
                "DewPointC": "-1",
                "DewPointF": "31",
                "WindChillC": "5",
                "WindChillF": "41",
                "WindGustMiles": "17",
                "WindGustKmph": "28",
                "FeelsLikeC": "5",
                "FeelsLikeF": "41",
                "chanceofrain": "33",
                "chanceofremdry": "60",
                "chanceofwindy": "0",
                "chanceofovercast": "86",
                "chanceofsunshine": "11",
                "chanceoffrost": "0",
                "chanceofhightemp": "0",
                "chanceoffog": "0",
                "chanceofsnow": "0",
                "chanceofthunder": "0",
                "uvIndex": "2"
            },
            {
                "time": "1500",
                "tempC": "8",
                "tempF": "47",
                "windspeedMiles": "12",
                "windspeedKmph": "19",
                "winddirDegree": "304",
                "winddir16Point": "WNW",
                "weatherCode": "119",
                "weatherIconUrl": [
                    {
                        "value": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0003_white_cloud.png"
                    }
                ],
                "weatherDesc": [
                    {
                        "value": "Cloudy"
                    }
                ],
                "precipMM": "0.1",
                "humidity": "55",
                "visibility": "16",
                "pressure": "1019",
                "cloudcover": "70",
                "HeatIndexC": "8",
                "HeatIndexF": "47",
                "DewPointC": "0",
                "DewPointF": "31",
                "WindChillC": "5",
                "WindChillF": "42",
                "WindGustMiles": "15",
                "WindGustKmph": "24",
                "FeelsLikeC": "5",
                "FeelsLikeF": "42",
                "chanceofrain": "49",
                "chanceofremdry": "30",
                "chanceofwindy": "0",
                "chanceofovercast": "83",
                "chanceofsunshine": "5",
                "chanceoffrost": "0",
                "chanceofhightemp": "0",
                "chanceoffog": "0",
                "chanceofsnow": "0",
                "chanceofthunder": "0",
                "uvIndex": "2"
            },
            {
                "time": "1800",
                "tempC": "7",
                "tempF": "44",
                "windspeedMiles": "8",
                "windspeedKmph": "13",
                "winddirDegree": "308",
                "winddir16Point": "NW",
                "weatherCode": "176",
                "weatherIconUrl": [
                    {
                        "value": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png"
                    }
                ],
                "weatherDesc": [
                    {
                        "value": "Patchy rain possible"
                    }
                ],
                "precipMM": "0.0",
                "humidity": "67",
                "visibility": "16",
                "pressure": "1021",
                "cloudcover": "29",
                "HeatIndexC": "7",
                "HeatIndexF": "44",
                "DewPointC": "1",
                "DewPointF": "34",
                "WindChillC": "4",
                "WindChillF": "40",
                "WindGustMiles": "11",
                "WindGustKmph": "18",
                "FeelsLikeC": "4",
                "FeelsLikeF": "40",
                "chanceofrain": "24",
                "chanceofremdry": "61",
                "chanceofwindy": "0",
                "chanceofovercast": "50",
                "chanceofsunshine": "50",
                "chanceoffrost": "0",
                "chanceofhightemp": "0",
                "chanceoffog": "0",
                "chanceofsnow": "0",
                "chanceofthunder": "0",
                "uvIndex": "2"
            },
            {
                "time": "2100",
                "tempC": "6",
                "tempF": "43",
                "windspeedMiles": "4",
                "windspeedKmph": "7",
                "winddirDegree": "295",
                "winddir16Point": "WNW",
                "weatherCode": "116",
                "weatherIconUrl": [
                    {
                        "value": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png"
                    }
                ],
                "weatherDesc": [
                    {
                        "value": "Partly cloudy"
                    }
                ],
                "precipMM": "0.0",
                "humidity": "77",
                "visibility": "19",
                "pressure": "1023",
                "cloudcover": "5",
                "HeatIndexC": "6",
                "HeatIndexF": "43",
                "DewPointC": "2",
                "DewPointF": "36",
                "WindChillC": "5",
                "WindChillF": "40",
                "WindGustMiles": "6",
                "WindGustKmph": "10",
                "FeelsLikeC": "5",
                "FeelsLikeF": "40",
                "chanceofrain": "0",
                "chanceofremdry": "89",
                "chanceofwindy": "0",
                "chanceofovercast": "42",
                "chanceofsunshine": "79",
                "chanceoffrost": "0",
                "chanceofhightemp": "0",
                "chanceoffog": "0",
                "chanceofsnow": "0",
                "chanceofthunder": "0",
                "uvIndex": "3"
            }
        ]
    }
  ]}
});
