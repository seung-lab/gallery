'use strict';

// include axes for debugging
app.controller('ViewerCtrl', [
  '$scope', '$timeout', '$state', '$document', '$window', 'mesh', 'camera', 'cells',
  function ($scope, $timeout, $state, $document, $window, mesh, camera, cells) {
  
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

  mesh.clear();

  mesh.display($scope.neurons, function (fraction) {
    $scope.loading.value = Math.round(fraction * 100);
  })
  .finally(function (displayed_cells) { 
    var bbox = mesh.getVisibleBBox();
    camera.lookBBoxFromSide(bbox);
    camera.render();

    $scope.loading.show = false;
    $scope.loading.value = 100;

    return displayed_cells;
  });

  // Quick Search

  $scope.cells = [];
  $scope.celltypes = [];
  $scope.cellname = [];

  cells.list()
    .then(function (cellinfos) {
      $scope.cells = cellinfos.filter(function (cell) {
        return $scope.neurons.indexOf(parseInt(cell.id, 10)) !== -1;
      });

      $scope.cellnames = _.uniq($scope.cells.map( (cell) => cell.name ));
      $scope.celltypes = _.uniq($scope.cells.map( (cell) => cell.type ));

      self.states = loadAllAutocompletes(cellinfos);

      return cellinfos;
    });

    /**
   * Populates the autocomplete list shown
   */
  $scope.querySearch = function (query) {
    query = query || "";
    query = query.toLowerCase();

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
      $scope.goToResult(item);
    }, 0);
  };

  $scope.goToResult = function (item) {
    if (!item || !item.value) {
      return;
    }

    $state.go('viewer', {
      neurons: item.value,
    });
  };

  $scope.searchKeydown = function (evt) {
    if (evt.keyCode !== 13) { // enter key
      return;
    }

    if ($scope.selectedItem) {
      $scope.goToResult($scope.selectedItem);
    }
    else if ($scope.searchText) {
      let results = $scope.querySearch($scope.searchText);
      if (results.length) {
        $scope.goToResult(results[0]);
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
      field.value = field.value.join(",");
      return field;
    })
  }

    
  // Sidebar

  $scope.sidebar_open = false;

  angular.element(window).off('keydown.sidebarToggle').on('keydown.sidebarToggle', function (evt) {
    if (evt.keyCode === 32) {
      $scope.$apply(function () {
        $scope.toggle();  
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
      camera.useOrthographic();
    } 
    else {
      camera.usePerspective();
    }
  });

  $scope.views = [ "top", "side" ];
  $scope.current_view = null;

  camera.addEventListener('move', function () {
    $scope.$apply(function () {
      $scope.current_view = null;
    });
  });

  $scope.$watch('current_view', function () {
    let bbox = mesh.getVisibleBBox();

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

}]);