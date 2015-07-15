'use strict';

(function (app) {

app.controller('StratificationController', ['$rootScope','$scope','$timeout',
  function($rootScope, $scope, $timeout) {

    var data = { colors:{}, columns:[], type: 'line', unload: true};
    window.data = data;
    
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
      
      for (var i = 0; i < data.columns.length; ++i) {
        if (data.columns[i][0] == cellId) {
          delete data.colors[cellId];
          data.columns.splice(i,1);
          return;
        }
      }
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

      for (var i = 0; i < $scope.added.length ; ++i) {
        
        var cell_id = $scope.added[i];
        addCell(cell_id);

      }

      for (var i = 0; i < $scope.removed.length ; ++i) {
        
        var cell_id = $scope.removed[i];
        removeCell(cell_id);
        
      }

      updateChart();

    });
      

 }]);

})(app);

