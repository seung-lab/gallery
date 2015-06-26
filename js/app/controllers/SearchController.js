(function () { 
app.controller("SearchController", ["$scope", "$rootScope", "LocaleFactory",
  function($scope, $rootScope, locale) {
      $scope._ = locale._;
      $scope.message = "";
      $scope.search = function() {}
  }
]);
})();