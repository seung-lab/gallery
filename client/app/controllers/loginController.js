'use strict';

(function (app) {

app.controller('LoginController', function ($scope, $location, $window) {

	console.log($scope.auth.getCurrentUser());

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });


})(app);