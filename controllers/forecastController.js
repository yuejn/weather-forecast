require('dotenv').config()
const forecastUtils = require('../helpers').Forecast
const cityTimezones = require('city-timezones')
const moment = require('moment-timezone')

const WEATHER_API = process.env.WEATHER_API

exports.root = async (req, res) => {
  res.set('Content-Type', 'application/json')

  if (!req.query.city || !req.query.country) {
    return res.status(400)
      .json({
        message: 'Need `city` and `country` parameter.'
      })
  }

  const location = await forecastUtils.findCreateLocation({
    city: req.query.city,
    country: req.query.country
  })

  // Search for forecasts for today (at the location)
  // Without getting timezones, an Amsterdam-based server will not be able to
  // successfully fetch a forecast for a user in Shanghai.
  const cityLookup = cityTimezones.findFromCityStateProvince(`${req.query.city}, ${req.query.country}`)

  if (!cityLookup.length > 0) {
    return res.status(400)
      .json({
        message: 'Sorry. We couldn\'t find that city and country combination!'
      })
  }

  const timezone = cityLookup[0].timezone
  if (!location.timezone) {
    forecastUtils.updateLocationTimezone(location, timezone)
  }

  const dateAtLocation = moment.tz(moment(), timezone).format('YYYY-MM-DD')
  const date = moment.tz(dateAtLocation, 'YYYY-MM-DD', timezone).utc().format()

  // Search for the forecast
  let data = await forecastUtils.findForecast(location, date)

  if (data) {
    return res.status(200)
      .json({
        data
      })
  }

  // We can't find the API so we should fetch it from an external source
  const rawForecast = await forecastUtils.getForecast(`${req.query.city}, ${req.query.country}`, dateAtLocation, WEATHER_API)
  if (rawForecast.data.error) {
    return res.status(500)
      .json({
        error: rawForecast.data.error
      })
  }

  // We can do some housekeeping, assuming the chosen weather API of choice is worldweatheronline
  if (WEATHER_API == 'worldweatheronline') {
    if (!location.latitude || !location.longitude) {
      forecastUtils.updateLocationCoordinates(location, {
        longitude: rawForecast.data.nearest_area[0].longitude,
        latitude: rawForecast.data.nearest_area[0].latitude
      })
    }
  }

  // Parse the retrieved forecast, split it into Day and Periodics
  const parsedDayForecast = forecastUtils.parseDayForecast(rawForecast, timezone, WEATHER_API)
  const day = await forecastUtils.findCreateDayForecast(location, parsedDayForecast)

  if (!day.PeriodicForecasts) {
    const parsedPeriodics = []

    parsedDayForecast.periodics.forEach((periodicForecast) => {
      parsedPeriodics.push(forecastUtils.parsePeriodicForecast(day, periodicForecast, timezone, WEATHER_API))
    })

    await forecastUtils.importPeriodicForecasts(parsedPeriodics)
  }

  // Now re-fetch the forecast
  data = await forecastUtils.findForecast(location, day.date)

  return res.status(200)
    .json({
      data
    })
}
