'use strict';

( function (app) {
app.controller('UIController', ['$scope', '$rootScope', '$routeParams', '$location', 'SettingsFactory', 'UtilService', 'KeyboardFactory', 'TransitionerFactory', 'LocaleFactory', '$timeout', 'ModalFactory', '$route',
  function($scope, $rootScope, $routeParams, $location, settings, util, keyboard, transitioner, locale, $timeout, modal, $route) {

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

      $scope.nextcell = function() {
          var a, b, e = $routeParams.setId,
          f = $routeParams.cellId;
          e && f && (a = sets[e].children, a.forEach(function(a, c) {
              a.id == f && (b = c)
          }), b < a.length - 1 ? b++ : b = 0, $location.path('/set/' + e + '/' + a[b].id))
      };
      $scope.prevcell = function() {
          var a, b, e = $routeParams.setId,
          f = $routeParams.cellId;
          e && f && (a = sets[e].children, a.forEach(function(a, c) {
              a.id == f && (b = c)
          }), b > 0 ? b-- : b = a.length - 1, $location.path('/set/' + e + '/' + a[b].id))
      };
      $scope.trashSet = function() {
          $location.path('/');
          sets.remove($routeParams.setId);
      };
      $scope.duplicateSet = function() {
          var set = sets.get($routeParams.setId);
          $location.path('set/' + sets.save({
              name: set.name + ' (' + locale._.copy + ')',
              cells: set.children.slice(0)
          }) + '/')
      };
      $scope.rmcell = function(childIndex) {

          var set = sets.get($routeParams.setId);

          $location.path('set/' + set.id + '/');

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
      $scope.editcell = function(a) {
          $location.search('edit', a ? 'clone' : void 0), modal('components/new.html');
      };

      $scope.fullscreen = function() {
      
        for (var i = 1 ; i < 100 ; ++i) {
          $timeout( 
            function () { $rootScope.$broadcast('fullscreen'); } 
            ,i*10);
        }
  
      };

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
          return;

        }


      };

      function loadSet(current, previousSetId) {

        if (sets.get(current.params.setId) == -1) {

          loadFrontpage();
          return;

        }
        
        if (current.params.setId != previousSetId) {

          $rootScope.viewSlide.force = true;
          $rootScope.viewSlide.to = 'left';
          $rootScope.viewSlide.model = 'set';
          return;

        }


      };

      function loadCell(current ,previousSetId,  previousCellId) {

        if (cells.get(current.params.cellId) === -1) {
          $location.path(current.params.view + '/');
          return;
        }


        if (current.params.cellId === previousCellId) {

           transitioner.apply('cell-view', function() {
            $rootScope.cellSlide.model = '';
          }); 
          return;

        }

        if (previousSetId === current.params.setId) {
          $rootScope.cellSlide.to = 'left';
          return;
        }

      
        $rootScope.cellSlide.to = 'left'; 
       
                         
      };

      //This changes the views when the location changes
      $scope.$on('$routeChangeSuccess',
        function($routeChangeSuccess, current, previous) {

          if (previous) {
            var previousView = previous.params.view;
            var previousSetId = previous.params.setId;
            var previousCellId = previous.params.cellId;
          } 


          if ('/' === $location.path() ) {
            loadFrontpage();
            return;
          }

          if (current.params.view) {
            loadView(current ,previousSetId, previousView);
          }
          

          if (current.params.setId) {
            loadSet(current, previousSetId);
          }


          if (current.params.cellId) {
            loadCell(current , previousSetId , previousCellId);
          }
      });

      keyboard.on(['left', 'k', 'up', 'pageup'], function() { 
          $scope.$apply( 
              function() {  $scope.prevcell(); }
          );
      });
    
      keyboard.on('c', function() {
          return $scope.$apply(function() {
              settings.toggle('hideChords')
          }), !1
      });

      keyboard.on('=', function() {
          var b = settings.settings.fontSize || 0;
          2 > b && (settings.set('fontSize', b + 1), $scope.$apply())
      });

      keyboard.on('-', function() {
          var b = settings.settings.fontSize || 0;
          b && (settings.set('fontSize', b - 1), $scope.$apply())
      });

      $scope.$emit('$routeChangeSuccess', {
          params: $routeParams
      });
}]);

})(app);