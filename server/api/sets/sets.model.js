'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SetSchema = new Schema({
  name: String,
  id: String,
  children_are_cells: Boolean,
  children: []  
});

module.exports = mongoose.model('Set', SetSchema);