'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /1.0/cells', function() {

  it('should respond with JSON array', function(done) {

    request(app)
      .get('/1.0/cells')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });

  });

  it('should create a new cell', function(done) {

    var new_cell = {name: 'cell #11111', id: '1111'}
    request(app)
    .post('/1.0/cells')
    .send(new_cell)
    .expect(201)
    .expect('Content-Type', /json/)
    .end( function (err, res){
      if (err) return done(err);
      res.body.stratification.should.be.instanceof(Array);
      done();
    });
  });

  it('should retun the cell 60178', function(done) {
    request(app)
    .get('/1.0/cells/60178')
    .expect(200)
    .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        done();
    });

  });

  it('should update cell', function (done) {

    var update_cell = {name: 'new_name'}
    request(app)
    .put('/1.0/cells/60178')
    .send(update_cell)
    .expect(200)
    .expect('Content-Type', /json/)
    .end( function (err, res){
      if (err) return done(err);
      res.body.name.should.equal(update_cell.name);
      res.body.stratification.should.be.instanceof(Array);
      done();
    });
  });

  it('should delete a cell', function(done) {

    request(app)
    .delete('/1.0/cells/60178')
    .expect(204)
    .end(function(err, res) {
        if (err) { return done(err); }
        done();
    });

  });

});
