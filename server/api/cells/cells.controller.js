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

    return res.status(200).json(cells.map(function (cell) {
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
    
    if (!cell) { return res.sendStatus(404); }
  
    return res.json(cell);
  });
};

// Creates a new cells in the DB.
exports.create = function(req, res) {

  Cells.create(req.body, function(err, cells) {
    if (err) { return handleError(res, err); }
    return res.status(201).json(cells);
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
      return res.status(200).json(cell);
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


exports.batch = function (req, res) {
  Cells.find(function (err, cells) {
    if (err) { return handleError(res, err); }

    let idlst = req.query.ids || '';
    idlst = idlst.split(',').map(Number);
    let ids = {};
    for (let cid of idlst) {
      ids[cid] = true;
    }

    let output = cells.map(function (cell) {
      return {
        id: Number(cell.id),
        type: cell.name,
        class: cell.type,
        stratification: cell.stratification,
        directional_response: cell.directional_response,
        temporal_response: cell.temporal_response,
        classical_type: cell.classical_type,
      };
    })
    .filter(function (cell) {
      return ids[cell.id];
    });

    let filename = idlst.length ? idlst.join('_') : 'noresults';

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('content-disposition', `attachment; filename="${filename}.json"`);

    return res.status(200).json(output);
  });
};