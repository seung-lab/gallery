/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var sets = require('../api/sets/sets.model');
var user = require('../api/user/user.model');
var cells =require('../api/cells/cells.model');

sets.find({}).remove(function() {
  sets.create(
    {
      name: "Amacrine Cells",
      id: "a",
      children_are_cells: true,
      children: [900,903,915]
    }, {
      name: "Bipolar Cells",
      id: "b",
      children_are_cells: true,
      children: ["903","915"]
    }, {
      name: "Ganglion Cells",
      id: "c",
      children_are_cells: true,
      children: ["900", "915"],
      
    }, {
      name: "Horizontal Cells",
      id: "d",
      children_are_cells: true,
      children: ["903", "915"],     
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
    {
      name: "Cell #43a",
      id: 900,
      description: "Some very long description; Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu vulputate felis. Maecenas aliquam tellus vel neque porta semper. Nullam lacinia erat in consequat convallis. Fusce sed est ligula. Pellentesque imperdiet pellentesque lobortis. Duis faucibus quam vitae nisl sodales facilisis. ",
      copyright: "something",
      stratification: [65,59,10,81,56,55,40,3,1,90],
      color: '#00c5ff'
    }, {
      name: "Cell #903",
      id: 903,
      description: "Some very long description; Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu vulputate felis. Maecenas aliquam tellus vel neque porta semper. Nullam lacinia erat in consequat convallis. Fusce sed est ligula. Pellentesque imperdiet pellentesque lobortis. Duis faucibus quam vitae nisl sodales facilisis. ",
      copyright: "something",
      stratification: [65,59,90,12,15,20,40,65,59,90],
      color: '#4879ff'
    }, {
      name: "Cell #915",
      id: 915,
      description: "Some very long description; Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu vulputate felis. Maecenas aliquam tellus vel neque porta semper. Nullam lacinia erat in consequat convallis. Fusce sed est ligula. Pellentesque imperdiet pellentesque lobortis. Duis faucibus quam vitae nisl sodales facilisis. ",
      copyright: "something",
      stratification: [28,48,40,10,90,27,50,90,14,5],
      color: '#ffab41'
    }, function() {
      console.log('finished populating cells');
    }
  );
});

