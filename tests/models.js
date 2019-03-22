'use strict';
const chai = require('chai');
const expect = chai.expect;
const models = require('../models');

describe('Models and Sequelize', () => {
  it('returns the Location model', (done) => {
    expect(models.Location).to.be.ok;
    done();
  });
  it('returns the DayForecast model', (done) => {
    expect(models.DayForecast).to.be.ok;
    done();
  });
  it('returns the PeriodicForecast model', (done) => {
    expect(models.PeriodicForecast).to.be.ok;
    done();
  });
});

describe('Location', () => {
  before(done => {
    models.sequelize
      .sync({ force: true, match: /_test$/, logging: false })
      .then(() => {
        done();
      })
  });
  it('has a Location', async () => {
    await models.Location.create({
      areaName: 'Amsterdam',
      region: 'North Holland',
      country: 'Netherlands'
    });
    const location = await models.Location.findAll();
    expect(location).to.have.length(1);
  });
});
