'use strict';

const app = require('../app');
const models = require('../models');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

describe('app', () => {
  describe('GET /', () => {
    it('responds with status 200', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});

describe('GET /today', () => {
  describe('without ?location query', () => {
    it('responds with status code 400', (done) => {
      chai.request(app)
          .get('/today')
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
    })
  });
  describe('with ?location query', () => {
    it ('responds with status code 200', done => {
      chai.request(app)
          .get('/today?location=Amsterdam')
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.a('Object');
            done();
          });
    })
  })
});
//
// describe('App', () => {
//   describe('/set?somekey=somevalue', () => {
//     it('responds with status 200', (done) => {
//       chai.request(app)
//         .get('/set?somekey=somevalue')
//         .end((err, res) => {
//           res.should.have.status(200);
//           done();
//         });
//     });
//   });
// });


// describe("Locations", () => {
//   describe("GET /", () => {
//     it("it should return all Locations", done => {
//       models.Locations.create({
//         areaName: "Amsterdam",
//         region: "Noord-Holland",
//         country: "Netherlands"
//       }).then(() => {
//         chai.request(app)
//         .get('/')
//         .end((err, res) => {
//           res.should.have.status(200)
//           done()
//         })
//       })
//     })
//   })
// })
