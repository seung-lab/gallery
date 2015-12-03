'use strict';

(function (app) {

app.controller('LoginController', function ($scope, $location, $window) {

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });


})(app);