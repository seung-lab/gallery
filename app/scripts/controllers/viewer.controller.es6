'use strict';

// include axes for debugging
app.controller('ViewerCtrl', [
  '$scope', '$timeout', '$state', '$location', '$document', '$window', 'meshService', 'camera', 'cellSetsService', 'cellService', 'searchService', 'scene',
  function ($scope, $timeout, $state, $location, $document, $window, meshService, camera, cellSetsService, cellService, searchService, scene) {
  
  let self = this;

  $scope.cells = [];
  $scope.loading = {
    show: true,
    value: 0,
  };
  $scope.neurons = [];

  let cameraparams = {
    position: new THREE.Vector3(
      ...([$state.params.cx, $state.params.cy, $state.params.cz].map(Number))
    ),
    target: new THREE.Vector3(
      ...([$state.params.tx, $state.params.ty, $state.params.tz].map(Number))
    ),
    up: new THREE.Vector3(
      ...([$state.params.ux, $state.params.uy, $state.params.uz].map(Number))
    ),
  };

  $scope.displayCells = function (cell_ids = []) {
    $scope.loading = {
      show: true,
      value: 0,
    };

    clearScene();
    $scope.cells = [];
    $scope.sidebarFullscreen = false;

    cellService.clear();

    cellService.display(cell_ids, function (fraction, cell) {
      $timeout(function () {
        $scope.loading.value = Math.round(fraction * 100);  
      }, 0);
      
      if (cell) {
        $scope.cells.push(cell);
        $scope.cells = _.uniq($scope.cells);
      }
    })
    .finally(function () { 

      $scope.cells = $scope.cells.filter(function (cell) {
        return $scope.neurons.indexOf(parseInt(cell.id, 10)) !== -1;
      });

      $scope.cells.forEach( (cell) => scene.add(cell.mesh) );

      var bbox = meshService.getVisibleBBox($scope.cells);

      if (cameraparams.position.x && cameraparams.position.y && cameraparams.position.z) {
        camera.setView(cameraparams.position, cameraparams.target, cameraparams.up);
      }
      else {
        camera.lookBBoxFromSide(bbox);
      }

      camera.render();

      $scope.loading.show = false;
      $scope.loading.value = 100;
    });
  };


  let default_set = "26065,20117,26051,17212"; // Type 27

  let neuronparam = $state.params.neurons || default_set;

  $location.search('neurons', neuronparam);

  $scope.neurons = neuronparam.split(/ ?, ?/).filter( (x) => x ).map(function (cid) {
    return parseInt(cid, 10);
  });
    
  $scope.displayCells($scope.neurons);

  $scope.cell_classes = [];
  $scope.cell_types = [];

  $scope.$watch( () => $scope.cells.length, function () {
    $scope.cell_classes = _.uniq($scope.cells.map( (cell) => cell.type )); // gc, bipolar, etc
    $scope.cell_types = _.uniqBy($scope.cells.map( (cell) => {
      let classical_type = cell.classical_type;

      if (!classical_type) {
        return {
          type: cell.name,
          classical: null,
          securely_known: null,
        };
      }
      
      let classical_type_name = cellSetsService.classicalTypeToHtml(
        classical_type.correspondance
      );

      return {
        type: cell.name,
        classical: `(${classical_type_name})`,
        securely_known: classical_type.securely_known,
      };
    }), 'type'); // paper types
  });

  // Quick Search

  $scope.autocompleteLoaded = false;
  self.cellids_by_type = {};
  cellService.list()
    .then(function (cellinfos) {
      $scope.autocompleteLoaded = true;
      searchService.setDataset(cellinfos);
      self.cellids_by_type = createTypeList(cellinfos);
    });

  $scope.cellIdsForType = function (type) {
    return self.cellids_by_type[type];
  };

    /**
   * Populates the autocomplete list shown
   */
  $scope.querySearch = searchService.search;

  $scope.selectedItemChange = function (item) {
    // timeout fixes angular material bug where a mask is applied that
    // blocks the main area and doesn't get removed

    $timeout(function () {}, 0);
  };

  $scope.goToCellIds = function (cellids = []) {
    
    cellids = JSON.parse(JSON.stringify(cellids)).map(Number);
    cellids.sort();

    clearScene();

    $state.go('viewer', {
      neurons: cellids.join(','),
    });

    $scope.neurons = cellids;
    $scope.displayCells(cellids);
  };

  $scope.goToResult = function (item) {
    if (!item || !item.value) {
      return;
    }

    $scope.goToCellIds([ ...item.value ]);
  };

  $scope.searchKeydown = function (evt) {
    evt.stopPropagation();

    if (evt.keyCode !== 13) { // enter key
      return;
    }

    $scope.gotoFirstAutocompleteResult();
    angular.element(evt.target).blur();
  };

  $scope.gotoFirstAutocompleteResult = function () {
    if ($scope.selectedItem) {
      $scope.goToResult($scope.selectedItem);
    }
    else if ($scope.searchText) {

      let cellids = searchService.firstResults($scope.searchText);

      if (cellids.length) {
        $scope.goToCellIds(cellids);
      }
    }
  };

  function createTypeList (cellinfos) {
    let types = {};

    cellinfos.forEach(function (cell) {
      types[cell.name] = types[cell.name] || [];
      types[cell.name].push(parseInt(cell.id, 10));
    });

    return types;
  }


  // Main Menu Sidebar

  $scope.main_menu_open = $state.params.browse === '1';
  $scope.browse = $state.params.browse === '1';

  $scope.toggleMainMenu = function (evt) {
    // Solves bug where once button is clicked it gains focus
    // and space bar generates a click and a keydown event that 
    // cancel each other.
    if (evt && evt.target) {
      evt.target.blur();
    }

    if ($scope.main_menu_open && $scope.browse) {
      $scope.browse = false;
    }
    else {
      $scope.main_menu_open = !$scope.main_menu_open;
    }
    
    if ($scope.main_menu_open) {
      $scope.charts_open = false;
      // scroll to top of menu
    }
  };

  $scope.takeScreenshot = function () {
    let filename = $scope.cell_types.map( (type) => type.type ).join('_');

    let types = $scope.cell_types.map(function (type) {
      let secure = type.securely_known ? '?' : '';

      let classical = type.classical 
        ? type.classical.replace(/[\(\)]/g, '') 
        : null;

      let text = classical 
        ? `${type.type} (${classical}${secure})`
        : type.type;

      return text;
    }).sort().join(', ');

    let type_text = $scope.cell_types.length === 1 ? 'Type' : 'Types';

    camera.takeScreenshot(`${type_text} - ${types}`, filename);
  };

  $scope.toggleBrowse = function (evt) {
    if ($scope.main_menu_open && $scope.browse) {
      $scope.main_menu_open = false;
    }
    else if ($scope.main_menu_open && !$scope.browse) {
      $scope.browse = true;
    }
    else { // !$scope.main_menu_open
      $scope.main_menu_open = true;
      $scope.browse = true;
    }
  };

  // Charts Sidebar

  $scope.charts_open = $state.params.charts === '1';

  angular.element(window).off('keydown.sidebarToggle').on('keydown.sidebarToggle', function (evt) {
    let fn = function () {};

    if (evt.metaKey) {
      return;
    }

    if (evt.keyCode === 32) {
      fn = $scope.toggleCharts; 
    }
    else if (evt.keyCode === 66) { // b
      fn = $scope.toggleBrowse;
    }
    else if (evt.keyCode === 70) { // f
      fn = $scope.fullscreenToggle;
    }
    else if (evt.keyCode === 77) { // m
     fn = $scope.toggleMainMenu; 
    }
    else if (evt.keyCode === 79) { // o
      $scope.camera = 'orthographic';
    }
    else if (evt.keyCode === 80) { // p
      $scope.camera = 'perspective'; 
    }
    else if (evt.keyCode === 83) { // s
      $scope.current_view = 'side';
    }
    else if (evt.keyCode === 84) { // t
      $scope.current_view = 'top'; 
    }
    
    $scope.$apply(fn);
  });

  $scope.toggleCharts = function (evt) {

    // Solves bug where once button is clicked it gains focus
    // and space bar generates a click and a keydown event that 
    // cancel each other.
    if (evt && evt.target) {
      evt.target.blur();
    }

    $scope.charts_open = !$scope.charts_open;

    if ($scope.charts_open) {
      $scope.main_menu_open = false;
      angular.element('.characterization').scrollTo('#stratification-container', { msec: 0, offset: -100 });
    }
  };

  $scope.$watch('main_menu_open', function () {
    if (!$scope.main_menu_open && $scope.browse) {
      $scope.browse = false;
    }
  });

  $scope.$watch('browse', function () {
    $location.search('browse', $scope.browse ? '1' : null);

    if ($scope.browse) {
      $scope.main_menu_open = true;
      $scope.charts_open = false;
      $location.search('charts', null);
    }

    $location.replace();
  });

  $scope.$watch('charts_open', function () {
    $location.search('charts', $scope.charts_open ? '1' : null);

    if ($scope.charts_open) {
      $scope.main_menu_open = false;
      $location.search('browse', null);
    }

    $location.replace();
  });

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

    lookAgain(); // otherwise the camera is too zoomed in or out
  });

  function lookAgain () {
    let bbox = meshService.getVisibleBBox($scope.cells);
    $scope.current_view = $scope.current_view || 'side';
    
    if ($scope.current_view == "top") {
      camera.lookBBoxFromTop(bbox);
    }
    else if ($scope.current_view == "side") {
      camera.lookBBoxFromSide(bbox);
    } 
  }

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
    if (evt && evt.target) {
      evt.target.blur();
    }

    $scope.sidebarFullscreen = !$scope.sidebarFullscreen;
    $location.search('fullscreen', $scope.sidebarFullscreen ? '1' : null).replace();
    
  };

  // prevent scrolling on spacebar
  angular.element('body').keydown(function (evt) {
    if (evt.keyCode === 32) {
      evt.preventDefault();
    }
  });

  // Browser security requires copy to be tied to a user action
  (new Clipboard('#copy-view-url', {
    text: function () {
      let target = camera.getTarget();
      let position = camera.camera.position.clone();
      let up = camera.camera.up.clone();

      let fmt = (z, factor) => Math.round(z * Math.pow(10, factor)) / Math.pow(10, factor);

      let params = {
        cx: fmt(position.x, 2),
        cy: fmt(position.y, 2),
        cz: fmt(position.z, 2),
        tx: fmt(target.x, 2),
        ty: fmt(target.y, 2),
        tz: fmt(target.z, 2),
        ux: fmt(up.x, 6),
        uy: fmt(up.y, 6),
        uz: fmt(up.z, 6),
      };

      Object.keys(params).forEach(function (key) {
        $location.search(key, params[key]);
      });
      
      $timeout(function () {
        $location.replace();
      }, 0)
    
      return $location.absUrl();
    }
  }));

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