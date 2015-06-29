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

// Get list of setss
exports.index = function(req, res) {
  sets.find(function (err, setss) {
    if(err) { return handleError(res, err); }
    return res.json(200, setss);
  });
};

// Get a single sets
exports.show = function(req, res) {
  sets.findById(req.params.id, function (err, sets) {
    if(err) { return handleError(res, err); }
    if(!sets) { return res.send(404); }
    return res.json(sets);
  });
};

// Creates a new sets in the DB.
exports.create = function(req, res) {
  sets.create(req.body, function(err, sets) {
    if(err) { return handleError(res, err); }
    return res.json(201, sets);
  });
};

// Updates an existing sets in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  sets.findById(req.params.id, function (err, sets) {
    if (err) { return handleError(res, err); }
    if(!sets) { return res.send(404); }
    var updated = _.merge(sets, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, sets);
    });
  });
};

// Deletes a sets from the DB.
exports.destroy = function(req, res) {
  sets.findById(req.params.id, function (err, sets) {
    if(err) { return handleError(res, err); }
    if(!sets) { return res.send(404); }
    sets.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}