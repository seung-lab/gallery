/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var sets = require('../api/sets/sets.model');
var user = require('../api/user/user.model');
var cells =require('../api/cells/cells.model');

var cells_import = require('./cells.json')
var types_import = require('./types.json')

sets.find({}).remove(function() {

  var types = Object.keys(types_import).map(function (type) {
    var info = types_import[type];
    return {
      type: type,
      classical_type: info ? info.correspondance : null,
      securely_known: info ? info.securely_known : null,
      count: info ? info.count : null,    
    };
  });

  sets.create(types, function () {
    console.log('finished populating sets');
  });
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

