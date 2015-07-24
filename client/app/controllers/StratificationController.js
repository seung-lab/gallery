'use strict';

(function (app) {

app.controller('StratificationController', ['$rootScope','$scope','$timeout',
  function($rootScope, $scope, $timeout) {
      
    var data = { colors:{}, columns:[], type: 'line', unload: []};

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
    
    function watch () {

      $scope.$on('chart-resize', function(){  $scope.chart.resize();  });

      $scope.$watch('active', function(new_active, old_active) {

        if (new_active == old_active) { //Happens on first call
          old_active = [];  
        }

        data = { colors:{}, columns:[], type: 'line', unload: []}
        
        var add = _.difference(new_active, old_active);
        for (var i = add.length - 1; i >= 0; i--) {
          addCell(add[i])
        };

        var remove = _.difference(old_active, new_active);
        for (var i = remove.length - 1; i >= 0; i--) {
          removeCell(remove[i]);
        };

        updateChart();
      });


    }
    watch();
     


    //-------------------------------------------------------------------------------------------
    // Signals from the chart:
    // We will update the $RootScope.visible and $RootScope.active 
    // This will call watch and modify this chart, but also modify other views.
    //-------------------------------------------------------------------------------------------
    var old_visible = [];

    $scope.onLegendClick = function(cellId) {
      
      $rootScope.toggleVisible (cellId);
    };

    $scope.onLegendMouseout = function(cellId) {
      
      $rootScope.toggleVisible (old_visible);
      old_visible = [];

    };

    $scope.onLegendMouseover = function(cellId) {
      if ($scope.isVisible(cellId) == false) {
        return;
      }

      old_visible = _.difference( $rootScope.visible, [cellId]);      
      $rootScope.toggleVisible (old_visible);

    };



 }]);

})(app);

