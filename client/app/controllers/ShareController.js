'use strict';

( function (app) {

app.controller("ShareController", ["$scope", "$routeParams", "$rootScope", "MD5Factory", "UtilService",
  function($scope, $routeParams, $rootScope, md5, UtilService) {

    var sets = $rootScope.sets;
    $scope.md5 = md5;


    this.save = function () {
      console.log('saving');
    }
  }
]);

})(app);