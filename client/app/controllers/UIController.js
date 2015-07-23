'use strict';

( function (app) {
app.controller('UIController', ['$scope', '$rootScope', '$routeParams', '$location', 'SettingsFactory', 'UtilService', 'KeyboardFactory', 'TransitionerFactory', 'LocaleFactory', '$timeout', 'ModalFactory', '$route', 
  function($scope, $rootScope, $routeParams, $location, settings, util, keyboard, transitioner, locale, $timeout, modal, $route) {
      
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
      
        for (var i = 1 ; i < 100 ; ++i) {
          $timeout( 
            function () { $rootScope.$broadcast('fullscreen'); } 
            ,i*10);
        }
  
      };

      $scope.children = function () {

        function buildChildren( parentSet ) {
          var children = sets.get(parentSet).children;
          var setChildren = [];
          for ( var setIdx = 0 ; setIdx < children.length ; ++setIdx) { 

            var setId = children[setIdx];
            
            var set = sets.get(setId);
            if ( set == -1 ){
              continue;
            }

            if (parentSet === 0) {
              set.path = 'set/'+ setId;
              $scope.back = 'sets/'; 
            } else {
              set.path = 'set/' + parentSet + '/' + setId;
              $scope.back = 'set/' + parentSet;
            }


            setChildren.push(set);
          }

          return setChildren;

        };

        var currentSetId = $scope.r.setId;

        if (currentSetId === undefined) {
          return buildChildren(0); // Root Set
        } 
        else {
          return buildChildren( currentSetId);
        }

      }

      $scope.new = function () {
        if ($scope.r.view == "sets"){
          $scope.modal('components/new-set.html');
          return;
        }
        
        if ($scope.sets.get($scope.r.setId).children_are_cells == true) { 
          $scope.modal('components/new-cell.html');
        } 
        else {
          $scope.modal('components/new-set.html');
        }
      };

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

        if (['sets', 'catalog', 'search'].indexOf(current.params.view) == -1) {
          loadFrontpage();
          return;

        }

        if (previousSetId) {

          $rootScope.viewSlide.to = 'left';
          $rootScope.viewSlide.model = current.params.view;
          return;

        }
        
        if (current.params.view != previousView) {

          $rootScope.viewSlide.to = 'right';
          $rootScope.viewSlide.model = current.params.view;
          $rootScope.viewSlide.force = true;
          return;

        }


      };

      function loadSet(setIds, previousSetId) {

        var setIds = $routeParams.setIds.match( /\d+/g );

        console.log(setIds);

        // var set = sets.get(current.params.setId);

        // if (set == -1) {
        //   loadFrontpage();
        //   return;

        // }
        
        // if (current.params.setId != previousSetId) {

        //   $rootScope.viewSlide.force = true;
        //   $rootScope.viewSlide.to = 'left';

        // }

        // if (set.children_are_cells) {
        //   $rootScope.viewSlide.model = 'set';
        //   $rootScope.resetActive();
        //   $rootScope.toggleActive( set.children);
        //   $rootScope.toggleVisible( set.children);
        // } 
        // else
        // {
        //   if ( previousSetId == undefined ){
        //     $rootScope.viewSlide.to = 'left';    
        //   }
        //   else {
        //     $rootScope.viewSlide.to = 'right';    
        //   }

        //   $rootScope.viewSlide.model = 'sets';
        // }



   


      };

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

          console.log( current.params );

          if (previous) {
            var previousView = previous.params.view;
            var previousSetId = previous.params.setIds;
            var previousCellId = previous.params.cellId;
          } 


          if ('/' === $location.path() ) {
            loadFrontpage();
            return;
          }

          if (current.params.view) {
            loadView(current.params.setIds ,previousSetId);
          }
          

          if ($routeParams.setIds) {
            loadSet(current, previousSetId);
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