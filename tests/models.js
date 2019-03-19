'use strict';

const models = require('../models');
const chai = require('chai');
const expect = chai.expect;

describe('models/index', () => {
  before('initialise current models', () => {
    const models = require('../models');
  });
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
