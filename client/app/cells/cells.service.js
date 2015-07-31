'use strict';

(function(app) {

app.factory('Cells', ['$resource' , function ($resource) {

  return $resource('/api/cells/:id', {
    id: '@_id'
  });

}]);

})(app);