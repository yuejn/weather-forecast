'use strict';
const models = require('../models');
const forecast = require('../helpers');
const geocoder = require('geocoder');

exports.root = (req, res) => {
  res.sendStatus(200);
};

exports.getToday = async (req, res) => {
  if(!req.query.location) {
    res.status(400)
       .json({
        message: "Need `location` parameter."
      });
  } else {

    forecast.saveForecast;
    res.status(200);
    res.send();
  }
};
