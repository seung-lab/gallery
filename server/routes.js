/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/1.0/cells',require('./api/cells'));
  app.use('/1.0/mesh', require('./api/mesh'));
  app.use('/1.0/sets', require('./api/sets'));
  app.use('/1.0/user', require('./api/user'));
  
  // All undefined asset or api routes should return a 404
  app.route('/1.0/*')
   .get(errors[404]);

  app.use('/auth', require('./auth'));

  app.route([ '/', '/browse', '/about', '/credits' ])
    .get(function(req, res) {
      res.sendFile(app.get('appPath') + '/index.html');
  });

  app.route('/*').get(errors[404]);
};
