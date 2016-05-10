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
  .then(function () { 
    var bbox = mesh.getVisibleBBox();
    camera.lookBBoxFromSide(bbox);

    $scope.loading.show = false;
    $scope.loading.value = 100;
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
    else {
      let results = $scope.querySearch($scope.txt);
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
    angular.element('.more-info').blur();

    $scope.sidebar_open = !$scope.sidebar_open;
  };

  $scope.$watch( (scope) => scope.sidebar_open, function () {
    let sidebar = angular.element('#right-sidebar'),
        fab = angular.element('button.more-info');

    sidebar.removeClass('onscreen');
    fab.removeClass('sidebar-open');
    if ($scope.sidebar_open) {
      sidebar.addClass('onscreen');
      fab.addClass('sidebar-open');
    }
  });


  // Cameras

  $scope.cameras = [ "orthographic", "perspective" ];

  $scope.camClick = function (cam) {

    if (cam === "orthographic") {
      camera.useOrthographic();
    } 
    else {
      camera.usePerspective();
    }
  };

  $scope.views = [ "top", "side" ];

  $scope.viewClick = function (view) {

    var bbox = mesh.getVisibleBBox();

    if (view == "top") {
      camera.lookBBoxFromTop(bbox);
    }
    else if (view == "side") {
      camera.lookBBoxFromSide(bbox);
    } 
    else {
      camera.lookBBoxFromOblique(bbox);
    }
  };
}]);