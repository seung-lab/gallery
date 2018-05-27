'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/gallery-dev'
  },
  port: 8080,
  seedDB: true
};
