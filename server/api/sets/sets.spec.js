'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/sets', function() {

  it('should respond with JSON array', function(done) {

    request(app)
      .get('/api/sets')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });

  });

  it('should create a new set', function(done) {

    var new_set = {name: 'root' , children_are_cells: true}
    request(app)
    .post('/api/sets')
    .send(new_set)
    .expect(201)
    .expect('Content-Type', /json/)
    .end( function (err, res){
      if (err) return done(err);
      res.body.children.should.be.instanceof(Array);
      done();
    });
  });

  it('should retun the root of the tree', function(done) {
    request(app)
    .get('/api/sets/0')
    .expect(200)
    .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        done();
    });

  });

  it('should update set', function (done) {

    var update_set = {name: 'new_name' , children_are_cells: false}
    request(app)
    .put('/api/sets/0')
    .send(update_set)
    .expect(200)
    .expect('Content-Type', /json/)
    .end( function (err, res){
      if (err) return done(err);
      res.body.name.should.equal(update_set.name);
      res.body.children_are_cells.should.equal(false);
      res.body.children.should.be.instanceof(Array);
      done();
    });
  });

  it('should delete a set', function(done) {

    request(app)
    .delete('/api/sets/0')
    .expect(204)
    .end(function(err, res) {
        if (err) { return done(err); }
        done();
    });

  });

});
