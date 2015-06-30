app.controller('stratificationController', ['$rootScope','$scope',
  function($rootScope, $scope){

    var data = {
      labels : [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0],
      datasets : [
        {
          fillColor : "rgba(220,220,220,0.5)",
          strokeColor : "rgba(220,220,220,1)",
          pointColor : "rgba(220,220,220,1)",
          pointStrokeColor : "#fff",
          data : [65,59,90,81,56,55,40,65,59,90]
        },
        {
          fillColor : "rgba(151,187,205,0.5)",
          strokeColor : "rgba(151,187,205,1)",
          pointColor : "rgba(151,187,205,1)",
          pointStrokeColor : "#fff",
          data : [28,48,40,19,96,27,100,90,81,56]
        }
      ]
    }

    $scope.$on('visible', function(event, args) {
      console.log('visible changed');
      console.log($rootScope.visible);
    });


    $scope.stratification = {"data": data, "options": {} };
 }]);