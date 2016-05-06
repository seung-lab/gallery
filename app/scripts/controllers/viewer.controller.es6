'use strict';

// include axes for debugging
app.controller('ViewerCtrl', [
  '$scope', '$timeout', '$state', '$document', '$window', 'mesh', 'camera', 'cells',
  function ($scope, $timeout, $state, $document, $window, mesh, camera, cells) {
  
  $scope.neurons = $state.params.neurons.split(/ ?, ?/).map(function (cid) {
    return parseInt(cid, 10);
  });

  mesh.display($scope.neurons, function () { 
    var bbox = mesh.getVisibleBBox();
    camera.lookBBoxFromSide(bbox);
  });
    
  // Sidebar

  $scope.sidebar_open = false;

  $scope.toggle = function () {
    $scope.sidebar_open = !$scope.sidebar_open;
  };

  $scope.$watch( (scope) => scope.sidebar_open, function () {
    let sidebar = angular.element('#right-sidebar'),
        fab = angular.element('button.more-info');

    sidebar.removeClass('onscreen');
    fab.removeClass('sidebar-open');
    if ($scope.sidebar_open) {
      sidebar.addClass('onscreen');
      fab.addClass('sidebar-open');
    }
  });


  // Cameras

  $scope.cameras = [ "orthographic", "perspective" ];

  $scope.camClick = function (cam) {

    if (cam === "ortographic") {
      camera.useOrtographic();
    } 
    else {
      camera.usePerspective();
    }
  };

  $scope.views = [ "top", "side" ];

  $scope.viewClick = function (view) {

    var bbox = mesh.getVisibleBBox();

    if (view == "top") {
      camera.lookBBoxFromTop(bbox);
    }
    else if (view == "side") {
      camera.lookBBoxFromSide(bbox);
    } 
    else {
      camera.lookBBoxFromOblique(bbox);
    }
  };
}]);