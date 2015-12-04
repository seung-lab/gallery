'use strict';

app.controller('ViewerCtrl',  function ($scope, $timeout, $mdSidenav, $log, $state,  $rootScope, $document, $window, mesh) {

  mesh.display($state.params.neurons)


    // Right sidenav , toggle, and resizing
    var maxWidth = $window.innerWidth * 0.9;
    var minWidth = $window.innerWidth * 0.15;
    $scope.width =  $window.innerWidth * 0.2;
    $scope.dragSidenav = function(e) {
      e.preventDefault()

      //When a mousedown is detected in the div
      //a mousemove and mouseup is bind to the window
      //When a mouseup is detected in the window, mousemove and mouse down is unbind 
      $document.on("mousemove", function(e) {

        //The timeout is required such that the view is updated
        var newWidth = $window.innerWidth - e.pageX;
        newWidth = Math.max( Math.min(newWidth,maxWidth) ,minWidth);
        $timeout(function() { $scope.width = newWidth; }, 0); });


      $document.on('mouseup', function(e) {
        $document.off("mousemove");
        $document.off("mouseup");
      });
      
    }
    
    $scope.toggle = function () {
      
      $mdSidenav('right').toggle()
        .then(function () {

          if ($scope.isOpenRight()) {
            $scope.$broadcast('resize')
          }

        });
    };
    $scope.isOpenRight = function() {
      return $mdSidenav('right').isOpen();
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
