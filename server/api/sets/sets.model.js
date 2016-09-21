'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SetsSchema = new Schema({
  type: String,
  classical_type: String,
  securely_known: Boolean,
  count: Number,
});

module.exports = mongoose.model('Sets', SetsSchema);
