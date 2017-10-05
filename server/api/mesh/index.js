'use strict';

var express = require('express');
var controller = require('./mesh.controller');


var router = express.Router();
router.get('/:id\.obj', controller.objformat);
router.get('/:id', controller.openctmformat);

module.exports = router;