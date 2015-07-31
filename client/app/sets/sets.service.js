'use strict';

(function(app) {

app.factory('Sets', ['$resource' , function ($resource) {

  return $resource('/api/sets/:id', {
    id: '@_id'
  });

}]);

})(app);