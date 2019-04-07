'use strict';

const app = require('../app');
const models = require('../models');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('The API', () => {
  describe('GET /today', () => {
    describe('without ?city&country query', () => {
      it('responds with status code 400', (done) => {
        chai.request(app)
        .get('/')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.type).to.equal('application/json');
          done();
        });
      });
    });
    describe('with ?city&country query', () => {
      it('responds with status code 200', done => {
        chai.request(app)
        .get('/?city=Amsterdam&country=Netherlands')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.type).to.equal('application/json');
          console.log(res.body)
          // expect(typeof res.body.weather).to.equal('object');
          done();
        });
      });
    })
  });
});
