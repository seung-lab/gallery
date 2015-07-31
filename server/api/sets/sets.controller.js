/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /sets              ->  index
 * POST    /sets              ->  create
 * GET     /sets/:id          ->  show
 * PUT     /sets/:id          ->  update
 * DELETE  /sets/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var sets = require('./sets.model');

// Get list of sets
exports.index = function(req, res) {

  sets.find(function (err, set) {
    if(err) { return handleError(res, err); }
    return res.json(200, set);
  });

};

// Get a single sets
exports.show = function(req, res) {

  sets.findOne({ id: req.params.id }, function (err, set) {
    
    if(err) { return handleError(res, err); }
    
    if(!set) { return res.send(404); }
  
    return res.json(set);
  });

};

// Creates a new sets in the DB.
exports.create = function(req, res) {

  sets.count({},function(error, count ){

    req.body.id = count; 

    sets.create(req.body, function(err, set) {
      if(err) { return handleError(res, err); }
      return res.json(201, set);
    });

  });
 
};

// Updates an existing sets in the DB.
exports.update = function(req, res) {

  if(req.body._id) { delete req.body._id; }
  
  sets.findOne({ id: req.params.id }, function (err, set) {
  
    if (err) { return handleError(res, err); }
    if(!set) { return res.send(404); }
  
    var updated = _.merge(set, req.body);
    
    set.update(
       { $set:  req.body } 
      , function (err) {
        if (err) { return handleError(res, err); }
        return res.json(200, updated);
      }

    );


  });
};

// Deletes a sets from the DB.
exports.destroy = function(req, res) {

  sets.findOne({ id: req.params.id }, function (err, set) {

    if(err) { return handleError(res, err); }
    if(!set) { return res.send(404); }

    set.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });

  });

};

function handleError(res, err) {
  return res.send(500, err);
}