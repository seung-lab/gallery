'use strict';
(function (app) {

app.controller('StratificationController', ['$rootScope','$scope','$timeout',
  function($rootScope, $scope, $timeout) {

    function loadCell( cellId ) {

      if (!$scope.chart) {
        $timeout( function(){  loadCell( cellId ); } , 100);
        return;
      }


      var cell = $scope.cells.get(cellId);
      if (cell === -1 ){
        console.log('cell doesn\'t exist');
        return;
      }

      var column =  cell.stratification.slice();
      column.unshift( cell.id.toString() );

      var data = {

        columns : [column],

        type: 'spline',

        color: cell.color 

      }
      $scope.chart.load(data);

    }

    $scope.$on('cell-load', function(event, cellId) {

      if (!cellId){
        return;
      }

      loadCell(cellId);
    });
      
    $scope.$on('cell-unload', function(event, cellId) {
      if (!cellId){
        return;
      }

      if (!$scope.chart) {
        return;
      }
       
      $scope.chart.unload({'ids': [cellId.toString()]});
      
    });

 }]);

})(app);

