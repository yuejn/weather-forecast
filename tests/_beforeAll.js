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
  date: '2019-03-19',
  sunrise: '2019-03-19 06:48',
  sunset: '2019-03-19 18:49',
  maxTempCelsius: 9,
  maxTempFahrenheit: 48,
  minTempCelsius: 5,
  minTempFahrenheit: 40,
});

chai.factory('location', {
  city: 'Amsterdam',
  country: 'Netherlands',
  latitude: '52.370216',
  longitude: '4.895168'
});


chai.factory('rawForecast', {
  "data": {
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
    },
  //   {
  //       "date": "2019-03-19",
  //       "astronomy": [
  //           {
  //               "sunrise": "06:46 AM",
  //               "sunset": "06:51 PM",
  //               "moonrise": "04:39 PM",
  //               "moonset": "06:28 AM",
  //               "moon_phase": "Full Moon",
  //               "moon_illumination": "98"
  //           }
  //       ],
  //       "maxtempC": "11",
  //       "maxtempF": "52",
  //       "mintempC": "3",
  //       "mintempF": "38",
  //       "totalSnow_cm": "0.0",
  //       "sunHour": "4.0",
  //       "uvIndex": "3",
  //       "hourly": [
  //           {
  //               "time": "24",
  //               "tempC": "11",
  //               "tempF": "52",
  //               "windspeedMiles": "5",
  //               "windspeedKmph": "8",
  //               "winddirDegree": "221",
  //               "winddir16Point": "SW",
  //               "weatherCode": "116",
  //               "weatherIconUrl": [
  //                   {
  //                       "value": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png"
  //                   }
  //               ],
  //               "weatherDesc": [
  //                   {
  //                       "value": "Partly cloudy"
  //                   }
  //               ],
  //               "precipMM": "0.0",
  //               "humidity": "73",
  //               "visibility": "20",
  //               "pressure": "1028",
  //               "cloudcover": "22",
  //               "HeatIndexC": "7",
  //               "HeatIndexF": "45",
  //               "DewPointC": "3",
  //               "DewPointF": "37",
  //               "WindChillC": "6",
  //               "WindChillF": "43",
  //               "WindGustMiles": "8",
  //               "WindGustKmph": "12",
  //               "FeelsLikeC": "6",
  //               "FeelsLikeF": "43",
  //               "chanceofrain": "0",
  //               "chanceofremdry": "89",
  //               "chanceofwindy": "0",
  //               "chanceofovercast": "35",
  //               "chanceofsunshine": "65",
  //               "chanceoffrost": "0",
  //               "chanceofhightemp": "0",
  //               "chanceoffog": "0",
  //               "chanceofsnow": "0",
  //               "chanceofthunder": "0",
  //               "uvIndex": "3"
  //           },
  //           {
  //               "time": "0",
  //               "tempC": "6",
  //               "tempF": "42",
  //               "windspeedMiles": "3",
  //               "windspeedKmph": "5",
  //               "winddirDegree": "252",
  //               "winddir16Point": "WSW",
  //               "weatherCode": "116",
  //               "weatherIconUrl": [
  //                   {
  //                       "value": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png"
  //                   }
  //               ],
  //               "weatherDesc": [
  //                   {
  //                       "value": "Partly cloudy"
  //                   }
  //               ],
  //               "precipMM": "0.0",
  //               "humidity": "79",
  //               "visibility": "20",
  //               "pressure": "1025",
  //               "cloudcover": "3",
  //               "HeatIndexC": "6",
  //               "HeatIndexF": "42",
  //               "DewPointC": "2",
  //               "DewPointF": "36",
  //               "WindChillC": "5",
  //               "WindChillF": "40",
  //               "WindGustMiles": "5",
  //               "WindGustKmph": "8",
  //               "FeelsLikeC": "5",
  //               "FeelsLikeF": "40",
  //               "chanceofrain": "0",
  //               "chanceofremdry": "92",
  //               "chanceofwindy": "0",
  //               "chanceofovercast": "43",
  //               "chanceofsunshine": "85",
  //               "chanceoffrost": "0",
  //               "chanceofhightemp": "0",
  //               "chanceoffog": "0",
  //               "chanceofsnow": "0",
  //               "chanceofthunder": "0",
  //               "uvIndex": "3"
  //           },
  //           {
  //               "time": "300",
  //               "tempC": "6",
  //               "tempF": "42",
  //               "windspeedMiles": "3",
  //               "windspeedKmph": "5",
  //               "winddirDegree": "220",
  //               "winddir16Point": "SW",
  //               "weatherCode": "116",
  //               "weatherIconUrl": [
  //                   {
  //                       "value": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png"
  //                   }
  //               ],
  //               "weatherDesc": [
  //                   {
  //                       "value": "Partly cloudy"
  //                   }
  //               ],
  //               "precipMM": "0.0",
  //               "humidity": "79",
  //               "visibility": "20",
  //               "pressure": "1025",
  //               "cloudcover": "1",
  //               "HeatIndexC": "6",
  //               "HeatIndexF": "42",
  //               "DewPointC": "3",
  //               "DewPointF": "37",
  //               "WindChillC": "5",
  //               "WindChillF": "40",
  //               "WindGustMiles": "4",
  //               "WindGustKmph": "7",
  //               "FeelsLikeC": "5",
  //               "FeelsLikeF": "40",
  //               "chanceofrain": "0",
  //               "chanceofremdry": "86",
  //               "chanceofwindy": "0",
  //               "chanceofovercast": "14",
  //               "chanceofsunshine": "86",
  //               "chanceoffrost": "0",
  //               "chanceofhightemp": "0",
  //               "chanceoffog": "0",
  //               "chanceofsnow": "0",
  //               "chanceofthunder": "0",
  //               "uvIndex": "3"
  //           },
  //           {
  //               "time": "600",
  //               "tempC": "4",
  //               "tempF": "40",
  //               "windspeedMiles": "4",
  //               "windspeedKmph": "7",
  //               "winddirDegree": "203",
  //               "winddir16Point": "SSW",
  //               "weatherCode": "113",
  //               "weatherIconUrl": [
  //                   {
  //                       "value": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0008_clear_sky_night.png"
  //                   }
  //               ],
  //               "weatherDesc": [
  //                   {
  //                       "value": "Clear"
  //                   }
  //               ],
  //               "precipMM": "0.0",
  //               "humidity": "82",
  //               "visibility": "20",
  //               "pressure": "1027",
  //               "cloudcover": "4",
  //               "HeatIndexC": "4",
  //               "HeatIndexF": "40",
  //               "DewPointC": "1",
  //               "DewPointF": "35",
  //               "WindChillC": "3",
  //               "WindChillF": "37",
  //               "WindGustMiles": "7",
  //               "WindGustKmph": "11",
  //               "FeelsLikeC": "3",
  //               "FeelsLikeF": "37",
  //               "chanceofrain": "0",
  //               "chanceofremdry": "83",
  //               "chanceofwindy": "0",
  //               "chanceofovercast": "31",
  //               "chanceofsunshine": "82",
  //               "chanceoffrost": "0",
  //               "chanceofhightemp": "0",
  //               "chanceoffog": "0",
  //               "chanceofsnow": "0",
  //               "chanceofthunder": "0",
  //               "uvIndex": "2"
  //           },
  //           {
  //               "time": "900",
  //               "tempC": "6",
  //               "tempF": "43",
  //               "windspeedMiles": "6",
  //               "windspeedKmph": "9",
  //               "winddirDegree": "205",
  //               "winddir16Point": "SSW",
  //               "weatherCode": "116",
  //               "weatherIconUrl": [
  //                   {
  //                       "value": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png"
  //                   }
  //               ],
  //               "weatherDesc": [
  //                   {
  //                       "value": "Partly cloudy"
  //                   }
  //               ],
  //               "precipMM": "0.0",
  //               "humidity": "76",
  //               "visibility": "20",
  //               "pressure": "1028",
  //               "cloudcover": "18",
  //               "HeatIndexC": "6",
  //               "HeatIndexF": "43",
  //               "DewPointC": "2",
  //               "DewPointF": "36",
  //               "WindChillC": "4",
  //               "WindChillF": "39",
  //               "WindGustMiles": "8",
  //               "WindGustKmph": "13",
  //               "FeelsLikeC": "4",
  //               "FeelsLikeF": "39",
  //               "chanceofrain": "0",
  //               "chanceofremdry": "86",
  //               "chanceofwindy": "0",
  //               "chanceofovercast": "42",
  //               "chanceofsunshine": "85",
  //               "chanceoffrost": "0",
  //               "chanceofhightemp": "0",
  //               "chanceoffog": "0",
  //               "chanceofsnow": "0",
  //               "chanceofthunder": "0",
  //               "uvIndex": "3"
  //           },
  //           {
  //               "time": "1200",
  //               "tempC": "9",
  //               "tempF": "49",
  //               "windspeedMiles": "7",
  //               "windspeedKmph": "11",
  //               "winddirDegree": "221",
  //               "winddir16Point": "SW",
  //               "weatherCode": "116",
  //               "weatherIconUrl": [
  //                   {
  //                       "value": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png"
  //                   }
  //               ],
  //               "weatherDesc": [
  //                   {
  //                       "value": "Partly cloudy"
  //                   }
  //               ],
  //               "precipMM": "0.0",
  //               "humidity": "64",
  //               "visibility": "20",
  //               "pressure": "1029",
  //               "cloudcover": "42",
  //               "HeatIndexC": "9",
  //               "HeatIndexF": "49",
  //               "DewPointC": "3",
  //               "DewPointF": "37",
  //               "WindChillC": "8",
  //               "WindChillF": "46",
  //               "WindGustMiles": "9",
  //               "WindGustKmph": "14",
  //               "FeelsLikeC": "8",
  //               "FeelsLikeF": "46",
  //               "chanceofrain": "0",
  //               "chanceofremdry": "87",
  //               "chanceofwindy": "0",
  //               "chanceofovercast": "36",
  //               "chanceofsunshine": "81",
  //               "chanceoffrost": "0",
  //               "chanceofhightemp": "0",
  //               "chanceoffog": "0",
  //               "chanceofsnow": "0",
  //               "chanceofthunder": "0",
  //               "uvIndex": "3"
  //           },
  //           {
  //               "time": "1500",
  //               "tempC": "11",
  //               "tempF": "52",
  //               "windspeedMiles": "7",
  //               "windspeedKmph": "12",
  //               "winddirDegree": "236",
  //               "winddir16Point": "WSW",
  //               "weatherCode": "116",
  //               "weatherIconUrl": [
  //                   {
  //                       "value": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png"
  //                   }
  //               ],
  //               "weatherDesc": [
  //                   {
  //                       "value": "Partly cloudy"
  //                   }
  //               ],
  //               "precipMM": "0.0",
  //               "humidity": "58",
  //               "visibility": "20",
  //               "pressure": "1029",
  //               "cloudcover": "32",
  //               "HeatIndexC": "11",
  //               "HeatIndexF": "52",
  //               "DewPointC": "3",
  //               "DewPointF": "38",
  //               "WindChillC": "10",
  //               "WindChillF": "49",
  //               "WindGustMiles": "9",
  //               "WindGustKmph": "15",
  //               "FeelsLikeC": "10",
  //               "FeelsLikeF": "49",
  //               "chanceofrain": "0",
  //               "chanceofremdry": "92",
  //               "chanceofwindy": "0",
  //               "chanceofovercast": "39",
  //               "chanceofsunshine": "72",
  //               "chanceoffrost": "0",
  //               "chanceofhightemp": "0",
  //               "chanceoffog": "0",
  //               "chanceofsnow": "0",
  //               "chanceofthunder": "0",
  //               "uvIndex": "4"
  //           },
  //           {
  //               "time": "1800",
  //               "tempC": "9",
  //               "tempF": "49",
  //               "windspeedMiles": "6",
  //               "windspeedKmph": "9",
  //               "winddirDegree": "242",
  //               "winddir16Point": "WSW",
  //               "weatherCode": "116",
  //               "weatherIconUrl": [
  //                   {
  //                       "value": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png"
  //                   }
  //               ],
  //               "weatherDesc": [
  //                   {
  //                       "value": "Partly cloudy"
  //                   }
  //               ],
  //               "precipMM": "0.0",
  //               "humidity": "67",
  //               "visibility": "20",
  //               "pressure": "1029",
  //               "cloudcover": "41",
  //               "HeatIndexC": "9",
  //               "HeatIndexF": "49",
  //               "DewPointC": "3",
  //               "DewPointF": "38",
  //               "WindChillC": "8",
  //               "WindChillF": "46",
  //               "WindGustMiles": "9",
  //               "WindGustKmph": "14",
  //               "FeelsLikeC": "8",
  //               "FeelsLikeF": "46",
  //               "chanceofrain": "0",
  //               "chanceofremdry": "90",
  //               "chanceofwindy": "0",
  //               "chanceofovercast": "42",
  //               "chanceofsunshine": "75",
  //               "chanceoffrost": "0",
  //               "chanceofhightemp": "0",
  //               "chanceoffog": "0",
  //               "chanceofsnow": "0",
  //               "chanceofthunder": "0",
  //               "uvIndex": "3"
  //           },
  //           {
  //               "time": "2100",
  //               "tempC": "8",
  //               "tempF": "46",
  //               "windspeedMiles": "5",
  //               "windspeedKmph": "8",
  //               "winddirDegree": "216",
  //               "winddir16Point": "SW",
  //               "weatherCode": "116",
  //               "weatherIconUrl": [
  //                   {
  //                       "value": "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png"
  //                   }
  //               ],
  //               "weatherDesc": [
  //                   {
  //                       "value": "Partly cloudy"
  //                   }
  //               ],
  //               "precipMM": "0.0",
  //               "humidity": "77",
  //               "visibility": "20",
  //               "pressure": "1030",
  //               "cloudcover": "31",
  //               "HeatIndexC": "8",
  //               "HeatIndexF": "46",
  //               "DewPointC": "4",
  //               "DewPointF": "39",
  //               "WindChillC": "6",
  //               "WindChillF": "43",
  //               "WindGustMiles": "9",
  //               "WindGustKmph": "14",
  //               "FeelsLikeC": "6",
  //               "FeelsLikeF": "43",
  //               "chanceofrain": "0",
  //               "chanceofremdry": "92",
  //               "chanceofwindy": "0",
  //               "chanceofovercast": "44",
  //               "chanceofsunshine": "84",
  //               "chanceoffrost": "0",
  //               "chanceofhightemp": "0",
  //               "chanceoffog": "0",
  //               "chanceofsnow": "0",
  //               "chanceofthunder": "0",
  //               "uvIndex": "3"
  //           }
  //       ]
  // }
  ]}
});
