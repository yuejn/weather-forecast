const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', forecastController.root);
router.get('/today', forecastController.getToday);

module.exports = router;
