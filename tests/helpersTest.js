'use strict';

const models = require('../models');
const forecast = require('../helpers');
const chai = require('chai');
const expect = chai.expect;

describe('Forecast', () => {
  before(done => {
    models.sequelize
      .sync({ force: true, match: /_test$/, logging: false })
      .then(() => {
        done();
      })
  });

  it('findLocation()', async () => {
    const location = {
      name: 'Amsterdam',
      region: 'North Holland',
      country: 'Netherlands'
    }

    await models.Location.findOrCreate({
      where: {
        areaName: location.name
      },
      defaults: {
        region: location.region,
        country: location.country
      }
    })

    const locationCount = await models.Location.findOne({
      where: {
        name: location.name
      }
    });
    expect(locationCount).to.have.length(1)
  });

});

// 'use strict';
// const models = require('../models');
// const forecast = require('../helpers');
// const chai = require('chai');
// const expect = chai.expect;
// //
// // describe('time helpers', () => {
// //   it('converts String to Time', done => {
// //     const stringTime = '2018-12-05 06:45 PM';
// //     const convertedTime = new Date('2018-12-05 06:45 PM');
// //     console.log(stringTime)
// //     console.log(convertedTime)
// //     const fn = forecast.convertToDateTime(stringTime)
// //     console.log(fn)
// //     expect(forecast.convertToDateTime(stringTime)).to.be(convertedTime);
// //     expect(forecast.convertToDateTime(stringTime)).to.equal(convertedTime);
// //   })
// // });
// //
// // beforeAll('initialise current models', () => {
// //   const models = require('../models');
// // });
// //
// describe('src/models/Simple', () => {
//   const Model = models.Location(sequelize, dataTypes)
//   const instance = new Model()
//   checkModelName(Model)('Simple')
//   context('properties', () => {
//     ;['name', 'email'].forEach(checkPropertyExists(instance))
//   })
// })
// //
// // describe('#findLocation()', () => {
// //   it('responds with matching record', async done => {
// //     const records = await models.Location.find({
// //       where: {
// //         areaName:
// //       }
// //     });
// //     records.should.eventually.have.length(1);
// //     done();
// //   })
// // });
