'use strict';
const models = require('./models');
const app = require('./app');

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
