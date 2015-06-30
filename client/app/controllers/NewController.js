'use strict';

( function (app) {

app.controller("NewController", ["$scope", "$rootScope", "cellMode", "$routeParams", "UtilService", "LocaleFactory", "NotifierFactory",
  function($scope, $rootScope, transposer, cellMode, $routeParams, util, locale, notifier) {

      $scope.cellMode = cellMode;
      $scope.langs = locale.langs;
      if ($routeParams.edit){
        $scope.cell = util.extend({}, i[$routeParams.cellId]);
      } 

      if ("clone" == $routeParams.edit) {
        delete $scope.cell.id;
      } 

      $scope.savecell = function(a, b) {
          
        $rootScope.cells.save(a); 

        notifier.notify({
            message: locale._.checkBody,
            icon: "alert"
        });
      }
}]);

})(app);