'use strict';

( function (app) {
app.controller('MainCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'SettingsFactory', 'UtilService', 'KeyboardFactory', 'TransitionerFactory', 'LocaleFactory', '$timeout', 'ModalFactory', '$route', 'Auth',
  function($scope, $rootScope, $routeParams, $location, settings, util, keyboard, transitioner, locale, $timeout, modal, $route, Auth) {
      
      //-------------------------------------------------------------------------------------------
      // global variables
      //-------------------------------------------------------------------------------------------
      var sets = $rootScope.sets;
      var cells = $rootScope.cells;

      $rootScope.cellSlide = {
          to: 'left'
      };
      $rootScope.viewSlide = {
          to: 'left'
      };
      
      $rootScope.r = $routeParams;

      $rootScope.p = function(path) {
          $location.path(path);
      };
      $rootScope.q = function(a, b) {
          $location.search(a, b)
      };
      $rootScope._ = locale._;
      $scope.s = settings.settings;
      $scope.pad = util.pad;

      $rootScope.auth = Auth;

      //-------------------------------------------------------------------------------------------
      // UI methods
      //-------------------------------------------------------------------------------------------


      $scope.trashSet = function() {
          $location.path('/');
          sets.remove($routeParams.setId);
      };

      $scope.duplicateSet = function() {

        var set = sets.get($routeParams.setId);

        var newSetId = sets.save({ name: set.name + ' (' + locale._.copy + ')',
                    children: set.children.slice(0),
                    children_are_cells: set.children_are_cells,
        });
        
        sets.get(0).children.push(newSetId);
        $location.path('/' +  newSetId );

      };

      $scope.rmcell = function(childIndex) {

          var set = sets.get($routeParams.setId);

          set.children.splice(childIndex, 1);
          
          if (set.children.length != 0) {
            sets.save(set);
          } 
          else {
            $scope.trashSet();
          } 
      };
      $scope.clean = function(a) {
          delete this[a]
      };
      $scope.sortSet = function(a, b) {
          util.move(sets, a, b)
      };
      $scope.sortcell = function(a, b) {
          var d = sets[$routeParams.setId];
          util.move(d.children, a, b), sets.save(d)
      };

      $scope.fullscreen = function() {
        $rootScope.$broadcast('fullscreen');        
      };

      $scope.new = function () {
        if ($scope.r.view == "sets"){
          $scope.modal('components/new-set.html');
          return;
        }
        
        if ($scope.set  && $scope.set.children_are_cells == true) { 
          $scope.modal('components/new-cell.html');
        } 
        else {
          $scope.modal('components/new-set.html');
        }
      };

      $scope.parentPath = function() {

        $rootScope.viewSlide.to = 'right';
        $rootScope.viewSlide.force = true;    
        $location.path( 'set/' +_.dropRight($rootScope.setIds).join('/') );

      };

      $scope.childPath = function(childId) {

        $rootScope.viewSlide.to = 'left';
        $rootScope.viewSlide.force = true;    
        $location.path( 'set/'+ $rootScope.setIds.concat(childId).join('/') );

      };

      $scope.$on("angular-resizable.resizeEnd", function(event){ 
        $scope.$broadcast('chart-resize');
      });

      //-------------------------------------------------------------------------------------------
      // Cells active and visible
      //-------------------------------------------------------------------------------------------

      $rootScope.active = [];

      //Visible cells are a subset of the active ones.
      $rootScope.visible = [];

      $rootScope.isActive = function (cellId) {
        return $rootScope.active.indexOf(cellId) != -1;
      };

      $rootScope.isVisible = function (cellId) {
        return $rootScope.visible.indexOf(cellId) != -1;
      };

      $rootScope.toggleActive = function(cellIds) {

        for (var i = cellIds.length - 1; i >= 0; i--) {
          var cellId = cellIds[i];
        
          if ($rootScope.isActive(cellId)) {

            var index = $rootScope.active.indexOf(cellId);
            $rootScope.active.splice(index,1);

            if ($rootScope.isVisible(cellId)) {
              $rootScope.toggleVisible(cellId);
            }

          }
          else {

            $rootScope.active.push(cellId);

          }

        }

        if(!$scope.$$phase) {
          $rootScope.$digest();
        }      

      };

      $rootScope.toggleVisible = function(cellIds) {

        cellIds = util.toArray(cellIds);

        for (var i = cellIds.length - 1; i >= 0; i--) {
          var cellId = cellIds[i];


          if ($rootScope.isVisible(cellId)) {

            var index = $rootScope.visible.indexOf(cellId);
            $rootScope.visible.splice(index,1);
          
          }
          else {

            $rootScope.visible.push(cellId);

            if ( $rootScope.isActive(cellId)  == false) {
              $rootScope.toggleActive(cellId);
            }

          }

        };

        if(!$scope.$$phase) {
          $rootScope.$digest();
        }
      };

      $rootScope.resetActive = function () {
        $rootScope.visible = [];
        $rootScope.active = [];

        if(!$scope.$$phase) {
          $rootScope.$digest();
        }
      }

      //-------------------------------------------------------------------------------------------
      // Routing
      //-------------------------------------------------------------------------------------------


      function loadFrontpage () {

        $location.path(sets.length ? 'sets/' : 'search/');

      };


      function loadView(current, previousSetId , previousView) {


        if (['sets', 'catalog', 'search'].indexOf($routeParams.view) == -1) {
          loadFrontpage();
          return;
        }

        if ($routeParams.view == 'sets'){
          $location.path('set/0');
          return;
        }

        
        if ($routeParams.view != previousView) {

          $rootScope.viewSlide.to = 'right';
          $rootScope.viewSlide.model = $routeParams.view;
          $rootScope.viewSlide.force = true;
          return;

        }


      };

      function loadSet(setIds, previousSetId) {

        var setIds = $routeParams.setIds.match( /\d+/g );
        $rootScope.setIds = setIds;

        for (var i = 0; i < setIds.length ; ++i ) {
          if ( sets.get(setIds[i]) == undefined  ) {
            loadFrontpage();
            return;
          }
        };
        

        for (var i = 0; i < setIds.length -1 ; ++i ) {
          if ( sets.get( setIds[i] ).children.indexOf( setIds[i+1] ) == -1 ) {
            loadFrontpage();
            return;
          }
        };

        var set = sets.get( _.last(setIds) );
        $rootScope.set = set;

        if (set.children_are_cells) {
          $rootScope.viewSlide.model = 'set';

          for (var idx = 0; idx < set.children.length ; ++idx) {
            cells.get( set.children[idx] ).color = getColor(idx);

          }

          $rootScope.resetActive();
          $rootScope.toggleActive( set.children );
          $rootScope.toggleVisible( set.children );
          return;

        }

        $rootScope.viewSlide.model = 'sets';
 

      };

      function getColor( i ) {
        //From https://en.wikipedia.org/wiki/Help:Distinguishable_colors
        // var colors = ['#F0A3FF','#0075DC','#993F00','#4C005C','#005C31','#2BCE48'
        //              ,'#FFCC99','#808080','#94FFB5','#8F7C00','#9DCC00','#C20088',
        //              '#003380','#FFA405','#FFA8BB','#FFA8BB','#426600','#FF0010',
        //              ,'#5EF1F2','#00998F','#740AFF','#990000','#FF5005','#FFFF00'];  

        //From distinguishable colors from matlab
        var colors = ['#00ff00','#0000ff','#ff0000','#ff1ab8','#00fff6','#ffdb72'
                      ,'#008cff','#007200','#ffcaed','#3d0069','#a72b3d','#95ff95'
                      ,'#b857ff','#725708','#348ca7','#dbff00','#ff8c00','#afc19e'
                      ,'#8c5783','#f69e83']

        return colors [ i % colors.length ]
      }

      function loadCell(current ,previousSetId,  previousCellId) {

        if (cells.get(current.params.cellId) === undefined) {
          $location.path(current.params.view + '/');
          return;
        }


        if (current.params.cellId === previousCellId) {

           transitioner.apply('cell-view', function() {
            $rootScope.cellSlide.model = '';
          }); 

        }

        if (previousSetId === current.params.setId) {
          $rootScope.cellSlide.to = 'left';
          ;
        }

      
        $rootScope.cellSlide.to = 'left'; 
        
        $rootScope.resetActive();
        $rootScope.toggleActive([current.params.cellId]);
        $rootScope.toggleVisible([current.params.cellId]);

                         
      };

      //This changes the views when the location changes
      $scope.$on('$routeChangeSuccess',
        function($routeChangeSuccess, current, previous) {

          if (previous) {
            var previousView = previous.params.view;
            var previousSetId = previous.params.setIds;
            var previousCellId = previous.params.cellId;
          } 


          if ('/' === $location.path() ) {
            loadFrontpage();
            return;
          }

          if ($routeParams.view) {
            loadView(current.params.setIds ,previousSetId, previousView);
          }
          

          if ($routeParams.setIds) {
            loadSet( previousSetId);
          }


          if (current.params.cellId) {
            loadCell(current , previousSetId , previousCellId);
          }


      });

      $scope.$emit('$routeChangeSuccess', {
          params: $routeParams
      });


      //-------------------------------------------------------------------------------------------
      // Keyboard
      //-------------------------------------------------------------------------------------------
      keyboard.on('=', function() {
          var b = settings.settings.fontSize || 0;
          2 > b && (settings.set('fontSize', b + 1), $scope.$apply())
      });

      keyboard.on('-', function() {
          var b = settings.settings.fontSize || 0;
          b && (settings.set('fontSize', b - 1), $scope.$apply())
      });



}]);

})(app);