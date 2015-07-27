'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var User = require('../api/user/user.model');

// Passport Configuration
require('./eyewire/passport').setup(User, config);

var router = express.Router();

router.use('/eyewire', require('./eyewire'));

module.exports = router;