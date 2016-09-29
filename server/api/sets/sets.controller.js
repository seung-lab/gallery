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

var path = require('path');
var fs = require('fs');

exports.index = function (req, res) {
  sets.find(function (err, retrieved_sets) {
    if (err) { return handleError(res, err); }

    var items = retrieved_sets.map(function (item) {
      return {
        type: item.type,
        classical_type: item.classical_type,
        securely_known: item.securely_known,
        count: item.count,
      };
    });

    return res.json(200, items);
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

  sets.findOne().sort('-id').exec(function(error, setWithLargestId ){

    req.body.id = setWithLargestId.id + 1; 

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
      
    set.update(
       { $set:  req.body } 
      , function (err) {
        if (err) { return handleError(res, err); }
        return res.json(200, req.body);
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

exports.preview = function (req, res) {
  var filename = req.params.id;

  filename = filename.replace(/\b(\d+\w+)\/preview\/?$/, '$1') + '.png';
  filename = filename.replace(/[\/ ]/g, '-');
  filename = filename.toLowerCase();

  var options = { 
    root: path.resolve("data/cell_previews/"),
    dotfiles: 'deny',
    headers: { 
      "Content-Type": 'image/png',

      // prevent compress from gzipping
      // which erases the content-length header
      // which is necessary for showing progress.
      // gzip -9 doesn't do anything for these anyway
      "Cache-Control": 'no-transform', 
    },
  };

  res.sendFile(filename, options, function (err) {
    if (err) { 
      console.log(filename, " -- file doesn't exist!");
    }
  });
};

function handleError(res, err) {
  return res.send(500, err);
}