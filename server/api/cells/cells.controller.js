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
var Cells = require('./cells.model');

// Get list of cells
// Excludes heavy data like stratification and calcium imaging
// So that the query isn't megabytes long
exports.index = function(req, res) {

  Cells.find(function (err, cells) {
    if (err) { return handleError(res, err); }

    return res.json(200, cells.map(function (cell) {
      return {
        id: cell.id,
        name: cell.name,
        type: cell.type,
        annotation: cell.annotation,
        segment: cell.segment,
      };
    }));
  });
};

// Get a single cells
exports.show = function(req, res) {

  Cells.findOne({ id: req.params.id }, function (err, cell) {
    if (err) { return handleError(res, err); }
    
    if (!cell) { return res.send(404); }
  
    return res.json(cell);
  });
};

// Creates a new cells in the DB.
exports.create = function(req, res) {

  Cells.create(req.body, function(err, cells) {
    if (err) { return handleError(res, err); }
    return res.json(201, cells);
  });

 
};

// Updates an existing cells in the DB.
exports.update = function(req, res) {

  if (req.body._id) { delete req.body._id; }
  
  Cells.findOne({ id: req.params.id }, function (err, cell) {
  
    if (err) { return handleError(res, err); }
    if (!cell) { return res.send(404); }
  
    var updated = _.merge(cell, req.body);
  
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, cell);
    });
  });
};

// Deletes a cells from the DB.
exports.destroy = function(req, res) {

  Cells.findOne({ id: req.params.id }, function (err, cell) {

    if (err) { return handleError(res, err); }
    if (!cell) { return res.send(404); }

    cell.remove(function(err) {
      if (err) { return handleError(res, err); }
      return res.send(204);
    });

  });

};

function handleError(res, err) {
  return res.status(500).send(err);
}