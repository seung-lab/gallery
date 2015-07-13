/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var sets = require('../api/sets/sets.model');
var user = require('../api/user/user.model');
var cells =require('../api/cells/cells.model');

var cells_import = require('../../import/cells.json')

sets.find({}).remove(function() {
  sets.create(
    {
      name: "root",
      id: 0,
      children_are_cells: false,
      children: [1,2,3,4]
    },
    {
      name: "Amacrine Cells",
      id: 1,
      children_are_cells: false,
      children: [6,7]
    }, {
      name: "Bipolar Cells",
      id: 2,
      children_are_cells: false,
      children: [5]
    }, {
      name: "Ganglion Cells",
      id: 3,
      children_are_cells: true,
      children: [1033, 1034, 1003],
      
    }, {
      name: "Horizontal Cells",
      id: 4,
      children_are_cells: true,
      children: [],     
    }, {
      name: "BC2",
      id: 5,
      children_are_cells: true,
      children: [487,488,489,490,491,492,493,494],     
    }, {
      name: "mfAC",
      id: 6,
      children_are_cells: true,
      children: [785,787],     
    }, {
      name: "wfAC",
      id: 6,
      children_are_cells: true,
      children: [902,904],     
    },
     function() {
      console.log('finished populating sets');
    }
  );
});

user.find({}).remove(function() {
  user.create(
  {
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});


cells.find({}).remove(function() {
  cells.create(
      cells_import, 
      function() {
      console.log('finished populating cells');
    });
});

