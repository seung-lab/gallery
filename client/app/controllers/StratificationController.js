'use strict';

(function (app) {

app.controller('StratificationController', ['$rootScope','$scope','$timeout', 'CellService',
  function($rootScope, $scope, $timeout, CellService) {
      
    var data;

    function updateChart () {
      
       if (!$scope.chart) {
        $timeout( function(){  updateChart(); } , 500);
        return;
      }

      $scope.chart.load(data);
    };

    var addCell = function( cellId ) {

      var cell = $scope.cells.get(cellId);
      var column =  cell.stratification.slice();
      var  name = cell.id;

      column.unshift( cell.id  );
      data.columns.push(column);
      data.colors[cell.id] = cell.color;
    }

    var removeCell = function ( cellId ) {
      data.unload.push( cellId );
    }
    
    function loadCell( cellId ) {

      if (!$scope.chart) {
        $timeout( function(){  loadCell( cellId ); } , 500);
        return;
      }

      addCell(cellId);
      updateChart();
    }

    $scope.$on('visible', function(event) {

      data = { colors:{}, columns:[], type: 'line', unload: []}

      for (var i = 0; i < $scope.visible.added.length ; ++i) {
        
        var cell_id = $scope.visible.added[i];
        addCell(cell_id);

      }

      for (var i = 0; i < $scope.visible.removed.length ; ++i) {
        
        var cell_id = $scope.visible.removed[i];
        removeCell(cell_id);
        
      }

      updateChart();

    });
      
    $scope.onLegendClick = function(cellId) {
      CellService.toggle( cellId );
    };

    $scope.onLegendMouseout = function(cellId) {
      console.log('mouse out ' +cellId);
    };

    $scope.onLegendMouseover = function(cellId) {
      console.log('mouse over ' + cellId);
    };



 }]);

})(app);

