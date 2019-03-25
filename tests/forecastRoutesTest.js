'use strict';

const app = require('../app');
const models = require('../models');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('The API', () => {
  describe('GET /', () => {
    it('responds with status 200', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
});

describe('GET /today', () => {
  describe('without ?city&country query', () => {
    it('responds with status code 400', (done) => {
      chai.request(app)
          .get('/today')
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
          .get('/today?city=Amsterdam&country=Netherlands')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.type).to.equal('application/json');
            done();
          });
    });
  })
});
