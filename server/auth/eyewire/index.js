'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router
  .get('/', passport.authenticate('oauth2', {
    failureRedirect: 'https://eyewire.org/signup',
    sesion: false
  }))

  .get('/callback', passport.authenticate('oauth2', {
    failureRedirect: 'https://eyewire.org/signup',
    session: false
  }), auth.setTokenCookie);

module.exports = router;