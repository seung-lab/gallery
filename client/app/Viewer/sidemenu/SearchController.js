'use strict';

(function (app) { 

app.controller("SearchController", ["$scope", "$rootScope", "LocaleFactory",
  function($scope, $rootScope, locale) {
      $scope._ = locale._;
      $scope.message = "";
      $scope.search = function() {}
  }
]);

})(app);