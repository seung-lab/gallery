'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CellSchema = new Schema({
  name: String,
  id: Number,
  description: String,
  copyright: String,
  stratification: [],
  color: String 
});

module.exports = mongoose.model('Cell', CellSchema);