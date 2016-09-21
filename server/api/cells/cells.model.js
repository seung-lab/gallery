'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CellSchema = new Schema({
  id: String,
  name: String,
  type: String,
  annotation: String,
  segment: Number,
  description: String,
  copyright: String,
  stratification: [],
  directional_response: {},
  temporal_response: [],
  classical_type: {},
  color: String,
});

module.exports = mongoose.model('Cell', CellSchema);
