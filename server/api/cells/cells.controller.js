/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /cells              ->  index
 * POST    /cells              ->  create
 * GET     /cells/:id          ->  show
 * PUT     /cells/:id          ->  update
 * DELETE  /cells/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var cells = require('./cells.model');

// Get list of cells
exports.index = function(req, res) {
  cells.find(function (err, cells) {
    if(err) { return handleError(res, err); }
    return res.json(200, cells);
  });
};

// Get a single cells
exports.show = function(req, res) {
  cells.findById({id: req.params.id}, function (err, cells) {
    if(err) { return handleError(res, err); }
    if(!cells) { return res.send(404); }
    return res.json(cells);
  });
};

// Creates a new cells in the DB.
exports.create = function(req, res) {
  cells.create(req.body, function(err, cells) {
    if(err) { return handleError(res, err); }
    return res.json(201, cells);
  });
};

// Updates an existing cells in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  cells.findById(req.params.id, function (err, cells) {
    if (err) { return handleError(res, err); }
    if(!cells) { return res.send(404); }
    var updated = _.merge(cells, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, cells);
    });
  });
};

// Deletes a cells from the DB.
exports.destroy = function(req, res) {
  cells.findById(req.params.id, function (err, cells) {
    if(err) { return handleError(res, err); }
    if(!cells) { return res.send(404); }
    cells.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}