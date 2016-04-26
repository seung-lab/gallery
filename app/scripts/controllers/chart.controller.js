'use strict';

(function (app) {

app.controller("chartCtrl", function($scope, $state, cells, mesh) {

    var data = { colors:{}, columns:[], type: 'line', unload: []};

    $scope.initChart = function() {
      
      $scope.$watch(function() { return $scope.width; }, function() {  $scope.chart.resize(); });
      $scope.$on('resize',  function() {  $scope.chart.resize(); });

      for (var i in $state.params.neurons) {

        var cell_id = $state.params.neurons[i]
        cells.show( cell_id , function(cell) { 

          addCell(cell);
        });

      }

    };

    var addCell = function( cell ) {

      var column =  cell.stratification.slice();
      column.unshift( cell.id  );

      data.columns.push(column);

      data.colors[cell.id] = cell.color;
      $scope.chart.load(data);
    }

    var removeCell = function ( cellId ) {
      data.unload.push( cellId );
      $scope.chart.load(data);
    }
    

    $scope.onLegendClick = function(cell_id) {
      
      mesh.toggleVisibility(cell_id);
    };

    $scope.onLegendMouseout = function(chosen_id) {

      for (var id in data.colors) {
         
         if (id != chosen_id) {

          mesh.setOpacity( id , 1.0)
        }
      }
      
    };

    $scope.onLegendMouseover = function(chosen_id) {
      
      for (var id in data.colors) {
        
        if (id != chosen_id) {

          mesh.setOpacity( id , 0.5)
        }
      }

    };



 });

})(app);

