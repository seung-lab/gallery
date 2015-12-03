'use strict';

(function (app) {

app.controller('NavigationCtrl', [ '$scope' , function ($scope) {

	$scope.new = function () {
    if ($scope.r.view == "sets"){
      $scope.modal('app/Viewer/sidemenu/new/new-set.html');
      return;
    }
    
    if ($scope.set  && $scope.set.children_are_cells == true) { 
      $scope.modal('app/Viewer/sidemenu/new/new-cell.html');
    } 
    else {
      $scope.modal('app/Viewer/sidemenu/new/new-set.html');
    }
  };

  $scope.help = function () {
    $scope.modal('app/Viewer/splash/splash.html');
  };

}]);


})(app);