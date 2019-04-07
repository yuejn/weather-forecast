'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = require('./routes');

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());

app.use('/', router);

// Handle 404s
app.use((req, res) => {
  res.status(404).json({
    message: 'Not found'
  })
});

module.exports = app;
