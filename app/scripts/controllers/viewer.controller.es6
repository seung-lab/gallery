'use strict';

// include axes for debugging
app.controller('ViewerCtrl',  function ($scope, $timeout, $state, $document, $window, mesh, camera) {
  
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
});


      // function getColor( i ) {
      //   //From https://en.wikipedia.org/wiki/Help:Distinguishable_colors
      //   // var colors = ['#F0A3FF','#0075DC','#993F00','#4C005C','#005C31','#2BCE48'
      //   //              ,'#FFCC99','#808080','#94FFB5','#8F7C00','#9DCC00','#C20088',
      //   //              '#003380','#FFA405','#FFA8BB','#FFA8BB','#426600','#FF0010',
      //   //              ,'#5EF1F2','#00998F','#740AFF','#990000','#FF5005','#FFFF00'];  

      //   //From distinguishable colors from matlab
      //   var colors = ['#00ff00','#0000ff','#ff0000','#ff1ab8','#00fff6','#ffdb72'
      //                 ,'#008cff','#007200','#ffcaed','#3d0069','#a72b3d','#95ff95'
      //                 ,'#b857ff','#725708','#348ca7','#dbff00','#ff8c00','#afc19e'
      //                 ,'#8c5783','#f69e83']

      //   return colors [ i % colors.length ]
      // }
