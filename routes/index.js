'use strict';

const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');

// Catch async/await errors
const catchErrors = fn => {
  return (req, res, next) => {
    return fn(req, res, next).catch(next);
  };
}

router.get('/', catchErrors(forecastController.root));

module.exports = router;
