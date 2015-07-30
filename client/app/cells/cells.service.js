'use strict';

(function(app) {

app.factory('Cell', ['$resource' , function ($resource) {

  return $resource('/api/cells/:id', {
    id: '@_id'
  });

}]);

})(app);