/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /mesh              ->  index
 * POST    /mesh              ->  create
 * GET     /mesh/:id          ->  show
 * PUT     /mesh/:id          ->  update
 * DELETE  /mesh/:id          ->  destroy
 */

var path = require('path');
var fs = require('fs');

// Get a single mesh
exports.show = function(req, res) {

  var options = { root: path.resolve("./import/mesh/"),
                  headers: { "Content-Type" : 'text/plain;'}
    }  

  //DEBUG
  // req.params.id  = 'male02';

  res.sendfile(req.params.id + '.ctm' , options , function(err) {
    console.log(err);
    if(err) { return handleError(res, err); }

  });

};

function handleError(res, err) {
  return res.send(404, "File doesn't exist");
}