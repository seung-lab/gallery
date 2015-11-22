'use strict';

(function (app) {

app.controller('NavigationCtrl', [ '$scope' , function ($scope) {

	$scope.new = function () {
    if ($scope.r.view == "sets"){
      $scope.modal('new/new-set.html');
      return;
    }
    
    if ($scope.set  && $scope.set.children_are_cells == true) { 
      $scope.modal('app/new/new-cell.html');
    } 
    else {
      $scope.modal('app/new/new-set.html');
    }
  };

  $scope.help = function () {
    $scope.modal('app/splash/splash.html');
  };

}]);


})(app);