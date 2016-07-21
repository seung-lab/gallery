'use strict';

// include axes for debugging
app.controller('ViewerCtrl', [
  '$scope', '$timeout', '$state', '$document', '$window', 'meshService', 'camera', 'cellService', 'scene',
  function ($scope, $timeout, $state, $document, $window, meshService, camera, cellService, scene) {
  
  let self = this;
  self.states = [];

  let neuronparam = $state.params.neurons || "";

  $scope.neurons = neuronparam.split(/ ?, ?/).filter( (x) => x ).map(function (cid) {
    return parseInt(cid, 10);
  });

  $scope.loading = {
    show: true,
    value: 0,
  };

  clearScene();
  $scope.cells = [];
  $scope.sidebarFullscreen = false;

  cellService.clear();

  cellService.display($scope.neurons, function (fraction, cell) {
    $timeout(function () {
      $scope.loading.value = Math.round(fraction * 100);  
    }, 0);
    
    if (cell && !cell.mesh) { 
      $scope.cells.push(cell);
    }
    else if (cell && cell.mesh && $scope.cells.indexOf(cell) !== -1) { 
      // indexOf prevents cells from a previous search that just completed rendering from appearing
      scene.add(cell.mesh);
    }

    camera.render();
  })
  .finally(function () { 
    var bbox = meshService.getVisibleBBox($scope.cells);
    camera.lookBBoxFromSide(bbox);
    camera.render();

    $scope.loading.show = false;
    $scope.loading.value = 100;
  });

  $scope.cellnames = [];
  $scope.celltypes = [];

  $scope.$watch( () => $scope.cells.length, function () {
    $scope.cellnames = _.uniq($scope.cells.map( (cell) => cell.name ));
    $scope.celltypes = _.uniq($scope.cells.map( (cell) => cell.type ));    
  });

  // Quick Search

  $scope.autocompleteLoaded = false;
  cellService.list()
    .then(function (cellinfos) {
      $scope.autocompleteLoaded = true;
      self.states = loadAllAutocompletes(cellinfos);
    });

    /**
   * Populates the autocomplete list shown
   */
  $scope.querySearch = function (query) {
    query = query || "";
    query = query.toLowerCase();
    query = query.split(/ *[ ,] */g);
    query = query.length 
      ? query[query.length - 1]
      : "";

    let results = query
      ? self.states.filter(function (state) {
          return state.value.toLowerCase().indexOf(query) > -1 || state.display.toLowerCase().indexOf(query) > -1;;
        })
      : self.states;

    return results || [];
  };

  $scope.selectedItemChange = function (item) {
    // fixes angular material bug where a mask is applied that
    // blocks the main area and doesn't get removed

    $timeout(function () {
      
    }, 0);
  };

  $scope.goToResult = function (item) {
    if (!item || !item.value) {
      return;
    }

    clearScene();

    $state.go('viewer', {
      neurons: item.value,
    });
  };

  $scope.searchKeydown = function (evt) {
    evt.stopPropagation();

    if (evt.keyCode !== 13) { // enter key
      return;
    }

    $scope.gotoFirstAutocompleteResult();
  };

  $scope.gotoFirstAutocompleteResult = function () {
    if ($scope.selectedItem) {
      $scope.goToResult($scope.selectedItem);
    }
    else if ($scope.searchText) {
      
      let neurons = [];

      $scope.searchText.split(/ *[ ,] */g).forEach(function (query) {
        let results = $scope.querySearch(query);

        if (results.length) {
          neurons.push.apply(neurons, results[0].value.split(/,/g));
        }
      });

      neurons = _.uniq(neurons);
      
      if (neurons.length) {
        $scope.goToResult({ value: neurons.join(',') });
      }
    }
  };

  /*
   * Build `states` list of key/value pairs
   */
  function loadAllAutocompletes (cellinfos) {
    let cells = {};
    function addInfo (cell, attr) {
      if (cell[attr] === undefined) {
        return;
      }

      cells[cell[attr]] = cells[cell[attr]] || {
        display: cell[attr] || "null",
        value: [],
      };

      cells[cell[attr]].value.push(cell.id);
    }


    for (let cell of cellinfos) {
      addInfo(cell, 'id');
      addInfo(cell, 'name');
      addInfo(cell, 'description');
      addInfo(cell, 'type');
    }
   
    return Object.keys(cells).map(function (key) {
      let field = cells[key];

      if (field.value.length > 1) {
        field.display += ` (${field.value.length} cells)`;
      }

      field.value = field.value.join(",");
      return field;
    })
  }

    
  // Sidebar

  $scope.sidebar_open = $state.params.fullscreen || false;;

  angular.element(window).off('keydown.sidebarToggle').on('keydown.sidebarToggle', function (evt) {
    if (evt.keyCode === 32) {
      $scope.$apply(function () {
        $scope.toggle();  
      });
    }
    else if (evt.keyCode === 70) { // f
      $scope.$apply(function () {
        $scope.fullscreenToggle();
      });
    }
  });

  $scope.toggle = function (evt) {

    // Solves bug where once button is clicked it gains focus
    // and space bar generates a click and a keydown event that 
    // cancel each other.
    if (evt) {
      evt.target.blur();
    }

    $scope.sidebar_open = !$scope.sidebar_open;

    if ($scope.sidebar_open) {
      angular.element('.characterization').scrollTo('#stratification', { msec: 0, offset: 0 });
    }
  };

  // Cameras

  $scope.cameras = [ "orthographic", "perspective" ];
  $scope.camera = "perspective";

  $scope.camClick = function (evt, cam) {
    evt.target.blur();
    $scope.camera = cam;
  };

  $scope.$watch('camera', function () {
    if ($scope.camera === "orthographic") {
      camera.orthographicMode();
    } 
    else {
      camera.perspectiveMode();
    }

    let bbox = meshService.getVisibleBBox($scope.cells);
    $scope.current_view = 'side';
    camera.lookBBoxFromSide(bbox);
  });

  $scope.views = [ "top", "side" ];
  $scope.current_view = null;

  camera.addEventListener('move', function () {
    $timeout(function () { // needed to avoid accidently executing inside an $apply
      $scope.current_view = null;
    }, 0);
  });

  $scope.$watch('current_view', function () {
    let bbox = meshService.getVisibleBBox($scope.cells);

    if ($scope.current_view == "top") {
      camera.lookBBoxFromTop(bbox);
    }
    else if ($scope.current_view == "side") {
      camera.lookBBoxFromSide(bbox);
    } 
  });

  $scope.viewClick = function (evt, view) {
    evt.target.blur();
    $scope.current_view = view;
  };

  $scope.sidebarFullscreen = $state.params.fullscreen || false;
  $scope.fullscreenToggle = function (evt) {
    if (evt) {
      evt.target.blur();
    }

    if (!$scope.sidebarFullscreen) { // If Fullscreen
      angular.element('#fullscreen-icon')
             .addClass('rotate-ninety');

      angular.element('.chart-view-container')
             .addClass('data-view-fullscreen');             

      angular.element('.data-view-container')
             .addClass('add-padding')

      angular.element('.chart-container')
             .addClass('row-align');

      angular.element('.radar-chart')
             .addClass('radar-chart-fullscreen');

      let display_units = { vh: "vh", vw: "vw" };

      // Find limiting screen dimension
      let limiting_factor = window.innerWidth < window.innerHeight
          ? display_units.vw
          : display_units.vh;

      angular.element('#preferred-direction-container')
             .css('max-width', 35 + limiting_factor);
    }
    else {
      angular.element('#fullscreen-icon')
             .removeClass('rotate-ninety');

      angular.element('.chart-view-container')
             .removeClass('data-view-fullscreen'); 

      angular.element('.data-view-container')
             .removeClass('add-padding')

      angular.element('.chart-container')
             .removeClass('row-align');

      angular.element('.radar-chart')
              .removeClass('radar-chart-fullscreen');

      angular.element('#preferred-direction-container')
             .css('max-width', "100%");

      angular.element('#chart-container').css('width', '100%');
    }

    $scope.sidebarFullscreen = !$scope.sidebarFullscreen;
  };

  // prevent scrolling on spacebar
  angular.element('body').keydown(function (evt) {
    if (evt.keyCode === 32) {
      evt.preventDefault();
    }
  });

  function clearScene () {
    $scope.cells = $scope.cells || [];
    $scope.cells.length = 0;

    let objects = _.extend([], scene.children);
    objects.forEach(function (obj) {
      if (obj instanceof THREE.Mesh) {
        scene.remove(obj);
      }
    });

    camera.render();

    meshService.terminateWorkers();
  }
}]);