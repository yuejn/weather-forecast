const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', forecastController.root);
router.get('/today', catchErrors(forecastController.getToday));

module.exports = router;
