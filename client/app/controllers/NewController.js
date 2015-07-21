'use strict';

( function (app) {

app.controller("NewController", ["$scope", "$rootScope", "$routeParams", "UtilService", "LocaleFactory", "NotifierFactory",
  function($scope, $rootScope,  $routeParams, util, locale, Notifier) {

      $scope.langs = locale.langs;

      if ($routeParams.edit){
        $scope.cell = util.extend({}, i[$routeParams.cellId]);
      } 

      if ("clone" == $routeParams.edit) {
        delete $scope.cell.id;
      } 

      $scope.savecell = function(cell) {

        var set = $rootScope.sets.get($scope.r.setId);
        
        if (cell.id in set.children){
          console.log('already exists')
          return false;
        }

        set.children.push(cell.id);
        return true;
      }
}]);

})(app);