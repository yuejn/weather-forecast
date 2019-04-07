'use strict';
const models = require('../models');
const forecastUtils = require('../helpers').Forecast;
const textUtils = require('../helpers').Text;

const WEATHER_API = 'worldweatheronline';

exports.root = async (req, res) => {

  res.set('Content-Type', 'application/json');

  if (!req.query.city || !req.query.country) {
    return res.status(400)
     .json({
       message: 'Need `city` and `country` parameter.'
     })
     .send();
  }

  const location = await forecastUtils.findCreateLocation({
    city: req.query.city,
    country: req.query.country
  });

  // Search for forecasts for today and the location
  const date = textUtils.convertToDate(new Date());
  let data = await forecastUtils.findForecast(location, date);

  if (data) {
    return res.status(200)
    .json({
      data
    });
  } else {

    // We can't find the API so we should fetch it from an external source
    const rawForecast = await forecastUtils.getForecast(`${req.query.city}, ${req.query.country}`);

    // While we're fetching from the external API, we can do some housekeeping assuming the chosen weather API of choice is worldweatheronline
    if (!location.latitude || !location.longitude) {
      forecastUtils.updateLocationCoordinates(location, {
        longitude: rawForecast.data.nearest_area[0].longitude,
        latitude: rawForecast.data.nearest_area[0].latitude
      })
    }

    // Parse the retrieved forecast, split it into Day and Periodics
    const parsedDayForecast = forecastUtils.parseDayForecast(rawForecast, WEATHER_API);
    const day = await forecastUtils.findCreateDayForecast(location, parsedDayForecast);

    let parsedPeriodics = [];
    parsedDayForecast.periodics.forEach(periodicForecast => {
      parsedPeriodics.push(forecastUtils.parsePeriodicForecast(day, periodicForecast, WEATHER_API));
    });

    const periodics = await forecastUtils.importPeriodicForecasts(parsedPeriodics);

    // Now re-fetch the forecast
    data = await forecastUtils.findForecast(location, day.date);

    return res.status(200)
     .json({
       data
     });
  }
}

//
// exports.getToday = async (req, res) => {
//   if(!req.query.city || !req.query.country) {
//     res.status(400)
//        .json({
//         message: "Need `city` and `country` parameter."
//       });
//   } else {
//
//     const city = req.query.city;
//     const country = req.query.country;
//     const searchLocation = { city: city, country: country }
//
//     const location = await helpers.findCreateLocation(searchLocation);
//
//     const getForecasts = await models.PeriodicForecast.findAll({
//       include: [{
//         model: models.DayForecast,
//         required: true,
//         where: {
//           date: new Date().getDate()
//         },
//         include: [{
//           model: models.Location,
//           required: true,
//           where: {
//             id: location.id
//           }
//         }]
//       }]
//     });
//
//     if (getForecasts.length > 0) {
//       // console.log('getForecasts:', getForecasts);
//     } else {
//
//       const rawForecast = await helpers.getForecast('Amsterdam, Netherlands');
//       if (rawForecast.length == 2) {
//         const [code, response] = rawForecast;
//         return res.status(code).json({
//           source: 'External weather forecast source',
//           message: response
//         });
//       }
//
//       const dayForecast = helpers.parseDayForecast(rawForecast, WEATHER_API);
//
//       const day = helpers.findCreateDayForecast(location.id, dayForecast);
//
//       // console.log(day)
//       // const day = await models.DayForecast.findOrCreate({
//       //   LocationId: location.id,
//       //   ...dayForecast
//       // });
//
//       let periodics = [];
//       dayForecast.periodics.forEach(periodicForecast => {
//         periodics.push(
//           helpers.parsePeriodicForecast(day.date, day.id, periodicForecast, WEATHER_API)
//         )
//       });
//
//       const periodicForecasts = await models.PeriodicForecast.bulkCreate(
//         periodics,
//         { returning: true }
//       );
//
//       const getForecasts = await models.PeriodicForecast.findAll({
//         include: [{
//           model: models.DayForecast,
//           required: true,
//           where: {
//             date: new Date().getDate()
//           },
//           include: [{
//             model: models.Location,
//             required: true,
//             where: {
//               id: location.id
//             }
//           }]
//         }]
//       });
//       // console.log(getForecasts);
//
//     }
//
//     res.set('Content-Type', 'application/json');
//     res.status(200).json(getForecasts);
//   }
// };
