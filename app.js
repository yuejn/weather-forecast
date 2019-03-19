'use strict';

const models = require('./models');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = require('./routes');

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use('/', router);

module.exports = app;
